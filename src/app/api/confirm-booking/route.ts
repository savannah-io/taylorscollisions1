import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { verifyBooking } from '@/lib/booking-token'

export const runtime = 'nodejs'

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'info@taylorscollision.com'
const SHOP_PHONE = '(770) 495-0050'
const SHOP_ADDR = '2785 Buford Hwy STE 101, Duluth, GA 30096'

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

// "9:00 AM" / "12:45 PM" / "4:00 PM" -> { h, m } in 24h
function parseTime(s: string): { h: number; m: number } | null {
  const mch = s.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!mch) return null
  let h = parseInt(mch[1], 10)
  const m = parseInt(mch[2], 10)
  const pm = mch[3].toUpperCase() === 'PM'
  if (h === 12) h = pm ? 12 : 0
  else if (pm) h += 12
  return { h, m }
}

const pad = (n: number) => String(n).padStart(2, '0')

// Calendar invite. ORGANIZER = info@, ATTENDEEs = customer + the three
// shop inboxes, so the event lands on each of their calendars on accept.
function buildIcs(t: {
  name: string; email: string; iso: string; time: string; vehicle: string; phone: string
}): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.iso)) return null
  const tm = parseTime(t.time)
  if (!tm) return null
  const [Y, Mo, D] = t.iso.split('-').map(Number)
  const startMin = tm.h * 60 + tm.m
  const endMin = startMin + 30
  const dt = (mins: number) =>
    `${Y}${pad(Mo)}${pad(D)}T${pad(Math.floor(mins / 60))}${pad(mins % 60)}00`
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const uid = `${t.iso}-${startMin}-${(t.email || 'guest').replace(/[^a-z0-9]/gi, '')}@taylorscollision.com`
  const shop = (process.env.NOTIFY_EMAIL || 'info@taylorscollision.com')
    .split(',').map(s => s.trim()).filter(Boolean)
  const attendees = [t.email, ...shop]
    .filter(Boolean)
    .map(e => `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${e}`)
    .join('\r\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Taylor\'s Collision//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'TZNAME:EDT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/New_York:${dt(startMin)}`,
    `DTEND;TZID=America/New_York:${dt(endMin)}`,
    `SUMMARY:Free Collision Estimate — ${t.name || 'Customer'}`,
    `LOCATION:${SHOP_ADDR}`,
    `DESCRIPTION:Customer: ${t.name} (${t.phone})\\nVehicle: ${t.vehicle || 'n/a'}\\nBooked via taylorscollision.com`,
    'ORGANIZER;CN=Taylor\'s Collision:mailto:info@taylorscollision.com',
    attendees,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function page(title: string, bodyHtml: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
     <title>${title} — Taylor's Collision</title></head>
     <body style="margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f1f5f9;color:#0f172a">
       <div style="max-width:520px;margin:48px auto;background:#fff;border-radius:16px;padding:36px 28px;box-shadow:0 20px 50px -24px rgba(2,132,199,.35)">
         ${bodyHtml}
       </div>
     </body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const t = verifyBooking(sp.get('b') || '', sp.get('s') || '')
  if (!t) {
    return page('Invalid link', `<h2 style="color:#b91c1c">Link invalid or expired</h2>
      <p>This confirmation link couldn't be verified. Please call ${SHOP_PHONE}.</p>`, 400)
  }
  return page(
    'Confirm appointment',
    `<h2 style="color:#0c4a6e;margin:0 0 6px">Confirm this appointment</h2>
     <p style="color:#475569;margin:0 0 18px">Confirming emails <b>${t.name || 'the customer'}</b> right away.</p>
     <table style="width:100%;border-collapse:collapse;font-size:15px">
       <tr><td style="padding:7px 0;color:#64748b">Customer</td><td style="padding:7px 0;font-weight:600">${t.name}</td></tr>
       <tr><td style="padding:7px 0;color:#64748b">Email</td><td style="padding:7px 0">${t.email}</td></tr>
       <tr><td style="padding:7px 0;color:#64748b">Phone</td><td style="padding:7px 0">${t.phone}</td></tr>
       <tr><td style="padding:7px 0;color:#64748b">Date</td><td style="padding:7px 0;font-weight:600">${t.date}</td></tr>
       <tr><td style="padding:7px 0;color:#64748b">Time</td><td style="padding:7px 0;font-weight:600">${t.time}</td></tr>
       <tr><td style="padding:7px 0;color:#64748b">Vehicle</td><td style="padding:7px 0">${t.vehicle || '—'}</td></tr>
     </table>
     <form method="POST" style="margin-top:24px">
       <input type="hidden" name="b" value="${sp.get('b') || ''}">
       <input type="hidden" name="s" value="${sp.get('s') || ''}">
       <button type="submit" style="width:100%;background:#0ea5e9;color:#fff;border:0;font-size:16px;font-weight:700;padding:15px;border-radius:10px;cursor:pointer">
         Confirm &amp; email ${t.name || 'customer'}
       </button>
     </form>`
  )
}

export async function POST(req: NextRequest) {
  const fd = await req.formData()
  const t = verifyBooking(String(fd.get('b') || ''), String(fd.get('s') || ''))
  if (!t) {
    return page('Invalid link', `<h2 style="color:#b91c1c">Link invalid or expired</h2>
      <p>Please call ${SHOP_PHONE}.</p>`, 400)
  }

  const ics = buildIcs(t)
  try {
    const transporter = createTransport()
    await transporter.sendMail({
      from: `"Taylor's Collision" <${process.env.SMTP_USER}>`,
      to: t.email,
      cc: NOTIFY_EMAIL, // the 3 shop inboxes — invite lands on their calendars
      subject: `Appointment Confirmed — ${t.date} at ${t.time}`,
      ...(ics
        ? {
            icalEvent: { method: 'REQUEST', filename: 'appointment.ics', content: ics },
            attachments: [{ filename: 'appointment.ics', content: ics, contentType: 'text/calendar; method=REQUEST' }],
          }
        : {}),
      html: `
        <div style="font-family:sans-serif;max-width:560px">
          <h2 style="color:#0c4a6e">You're confirmed${t.name ? `, ${t.name.split(' ')[0]}` : ''}! ✅</h2>
          <p>Your free estimate at <b>Taylor's Collision</b> is booked. We'll see you then:</p>
          <table style="border-collapse:collapse;width:100%;margin:14px 0">
            <tr><td style="padding:8px;background:#f5f7fa;font-weight:bold;width:130px">Date</td><td style="padding:8px;background:#f5f7fa">${t.date}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Time</td><td style="padding:8px">${t.time}</td></tr>
            <tr><td style="padding:8px;background:#f5f7fa;font-weight:bold">Vehicle</td><td style="padding:8px;background:#f5f7fa">${t.vehicle || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Where</td><td style="padding:8px">${SHOP_ADDR}</td></tr>
          </table>
          <p>Need to reschedule or running late? Call us at <a href="tel:+17704950050">${SHOP_PHONE}</a>.</p>
          <p style="color:#64748b;font-size:13px">Taylor's Collision · ${SHOP_ADDR}</p>
        </div>`,
    })
  } catch (err) {
    console.error('Confirmation email error:', err)
    return page('Could not send', `<h2 style="color:#b91c1c">Couldn't send the confirmation</h2>
      <p>Please call ${t.email ? `the customer at ${t.phone}` : SHOP_PHONE}.</p>`, 500)
  }

  return page(
    'Confirmed',
    `<div style="text-align:center">
       <div style="font-size:46px">✅</div>
       <h2 style="color:#0c4a6e;margin:8px 0">Appointment Confirmed</h2>
       <p style="color:#475569"><b>${t.name}</b> has been emailed a confirmation at<br><b>${t.email}</b>.</p>
       <p style="color:#64748b;font-size:14px">${t.date} · ${t.time}</p>
     </div>`
  )
}

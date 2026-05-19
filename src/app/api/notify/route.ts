import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { confirmUrl } from '@/lib/booking-token'

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'info@taylorscollision.com'

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { type, data } = body

  if (!type || !data) {
    return NextResponse.json({ error: 'Missing type or data' }, { status: 400 })
  }

  let subject = ''
  let html = ''

  switch (type) {
    case 'contact': {
      subject = `New Contact Message from ${data.name}`
      html = `
        <h2 style="color:#1e3a5f">New Contact Message — Taylor's Collision</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
          <tr><td style="padding:8px;font-weight:bold;width:140px">Name</td><td style="padding:8px">${data.name}</td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Service</td><td style="padding:8px">${data.service}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${data.message}</td></tr>
        </table>
      `
      break
    }
    case 'application': {
      subject = `New Job Application — ${data.position} — ${data.firstName} ${data.lastName}`
      html = `
        <h2 style="color:#1e3a5f">New Job Application — Taylor's Collision</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
          <tr><td style="padding:8px;font-weight:bold;width:160px">Name</td><td style="padding:8px">${data.firstName} ${data.lastName}</td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Position</td><td style="padding:8px">${data.position}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Experience</td><td style="padding:8px">${data.experience} years</td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Address</td><td style="padding:8px">${data.address}, ${data.city}, ${data.state} ${data.zip}</td></tr>
          ${data.resumeUrl ? `<tr><td style="padding:8px;font-weight:bold">Resume</td><td style="padding:8px"><a href="${data.resumeUrl}">View Resume</a></td></tr>` : ''}
        </table>
      `
      break
    }
    case 'appointment': {
      // Calendly webhook payload
      subject = `New Appointment Booked — ${data.invitee_full_name || 'Customer'}`
      html = `
        <h2 style="color:#1e3a5f">New Appointment — Taylor's Collision</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
          <tr><td style="padding:8px;font-weight:bold;width:160px">Name</td><td style="padding:8px">${data.invitee_full_name || ''}</td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${data.invitee_email || ''}">${data.invitee_email || ''}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Time</td><td style="padding:8px">${data.event_start_time || ''}</td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Event Type</td><td style="padding:8px">${data.event_type_name || 'Collision Estimate'}</td></tr>
        </table>
      `
      break
    }
    case 'appointment_request': {
      subject = `New Booking Request — ${data.name || 'Customer'} — ${data.preferred_date || ''} ${data.preferred_time || ''}`
      const cu = confirmUrl({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        vehicle: data.vehicle || '',
        date: data.preferred_date || '',
        time: data.preferred_time || '',
      })
      html = `
        <h2 style="color:#1e3a5f">New Booking Request — Taylor's Collision</h2>
        <p style="font-family:sans-serif;color:#1e3a5f">Review the request, then click <b>Confirm</b> — the customer is emailed an appointment confirmation automatically.</p>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
          <tr><td style="padding:8px;font-weight:bold;width:160px">Name</td><td style="padding:8px">${data.name || ''}</td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${data.email || ''}">${data.email || ''}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px"><a href="tel:${data.phone || ''}">${data.phone || ''}</a></td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Requested Date</td><td style="padding:8px">${data.preferred_date || ''}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Requested Time</td><td style="padding:8px">${data.preferred_time || ''}</td></tr>
          <tr style="background:#f5f7fa"><td style="padding:8px;font-weight:bold">Vehicle</td><td style="padding:8px">${data.vehicle || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Details</td><td style="padding:8px;white-space:pre-wrap">${data.notes || '—'}</td></tr>
        </table>
        <div style="margin:24px 0 8px">
          <a href="${cu}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;font-family:sans-serif;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:8px">✅ Confirm &amp; Email Customer</a>
        </div>
        <p style="font-family:sans-serif;color:#64748b;font-size:12px">Clicking opens a confirmation page; you confirm there and ${data.name || 'the customer'} is emailed automatically.</p>
      `
      break
    }
    default:
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  }

  try {
    const transporter = createTransport()
    await transporter.sendMail({
      from: `"Taylor's Collision Website" <${process.env.SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject,
      html,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

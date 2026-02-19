import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'support@taylorscollision.com'

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

import { NextRequest, NextResponse } from 'next/server'

// Calendly sends a POST to this endpoint when an appointment is booked.
// To set up: Calendly Dashboard → Integrations → Webhooks → Add webhook
// URL: https://yourdomain.com/api/webhooks/calendly
// Events: invitee.created

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Only handle new invitee (booking) events
    if (payload.event !== 'invitee.created') {
      return NextResponse.json({ ok: true })
    }

    const invitee = payload.payload?.invitee || {}
    const eventType = payload.payload?.event_type || {}
    const scheduledEvent = payload.payload?.scheduled_event || {}

    const data = {
      invitee_full_name: invitee.name || '',
      invitee_email: invitee.email || '',
      event_type_name: eventType.name || 'Collision Estimate',
      event_start_time: scheduledEvent.start_time
        ? new Date(scheduledEvent.start_time).toLocaleString('en-US', {
            timeZone: 'America/New_York',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        : '',
    }

    await fetch(`${req.nextUrl.origin}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'appointment', data }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Calendly webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

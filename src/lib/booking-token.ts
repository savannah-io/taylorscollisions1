import crypto from 'crypto'

export interface BookingToken {
  name: string
  email: string
  phone: string
  vehicle: string
  date: string
  iso: string // YYYY-MM-DD, for the calendar event
  time: string
}

// Falls back to SMTP_PASS (already set in env) so no extra config is
// required; set CONFIRM_SECRET to rotate independently.
function secret() {
  return (
    process.env.CONFIRM_SECRET ||
    process.env.SMTP_PASS ||
    'tc-confirm-fallback-secret'
  )
}

export const SITE_URL =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://www.taylorscollision.com'

const b64url = (s: string) =>
  Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

function hmac(payload: string) {
  return crypto
    .createHmac('sha256', secret())
    .update(payload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function signBooking(data: BookingToken): { b: string; s: string } {
  const b = b64url(JSON.stringify(data))
  return { b, s: hmac(b) }
}

export function confirmUrl(data: BookingToken): string {
  const { b, s } = signBooking(data)
  return `${SITE_URL}/api/confirm-booking?b=${encodeURIComponent(b)}&s=${encodeURIComponent(s)}`
}

export function verifyBooking(b: string, s: string): BookingToken | null {
  try {
    const expected = hmac(b)
    const a = Buffer.from(s)
    const e = Buffer.from(expected)
    if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) return null
    const json = Buffer.from(b.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    return JSON.parse(json) as BookingToken
  } catch {
    return null
  }
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schedule a Free Estimate — Duluth, GA Auto Body Shop',
  description:
    "Book a free auto body estimate at Taylor's Collision in Duluth, GA. Same-day estimates, no obligation, insurance billing handled. Call (770) 495-0050 or schedule online.",
  alternates: { canonical: 'https://taylorscollision.com/schedule' },
  openGraph: {
    title: 'Schedule a Free Auto Body Estimate — Taylor\'s Collision',
    description: 'Same-day free estimates. No obligation. Insurance billing handled. Duluth, GA.',
    url: 'https://taylorscollision.com/schedule',
  },
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return children
}

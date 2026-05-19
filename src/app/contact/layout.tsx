import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Taylor\'s Collision — Auto Body Shop in Duluth, GA',
  description:
    "Contact Taylor's Collision: 2785 Buford Hwy Ste 101-C, Duluth, GA 30096. Call (770) 495-0050 for a free estimate. Mon–Fri 8:30 AM–6:00 PM. 24/7 emergency towing available.",
  alternates: { canonical: 'https://taylorscollision.com/contact' },
  openGraph: {
    title: 'Contact Taylor\'s Collision — Duluth, GA Auto Body Shop',
    description:
      "2785 Buford Hwy Ste 101-C, Duluth, GA 30096 · (770) 495-0050 · Mon–Fri 8:30–6:00 · Free estimates · 24/7 towing.",
    url: 'https://taylorscollision.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

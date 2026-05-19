import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auto Body Services in Duluth, GA — Collision Repair, Paint, Dent Removal',
  description:
    "Complete auto body services in Duluth, GA: collision repair, paintless dent repair, auto painting (PPG), bumper repair, frame straightening, and insurance claims assistance. Free estimates · Lifetime warranty · Insurance approved. Call (770) 495-0050.",
  alternates: { canonical: 'https://taylorscollision.com/services' },
  openGraph: {
    title: 'Auto Body Services in Duluth, GA — Taylor\'s Collision',
    description:
      'Collision repair, paintless dent repair, auto painting, bumper repair, frame work, and insurance claims. Family-owned in Duluth since 2010.',
    url: 'https://taylorscollision.com/services',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}

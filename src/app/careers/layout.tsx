import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers — Auto Body Jobs in Duluth, GA',
  description:
    "Hiring auto body technicians, painters, estimators, and customer service in Duluth, GA. Competitive pay, full benefits, family-owned culture. Apply online today.",
  alternates: { canonical: 'https://taylorscollision.com/careers' },
  openGraph: {
    title: 'Careers — Auto Body Jobs at Taylor\'s Collision (Duluth, GA)',
    description: 'Now hiring technicians, painters, estimators, and customer service. Competitive pay, benefits, family-owned culture.',
    url: 'https://taylorscollision.com/careers',
  },
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children
}

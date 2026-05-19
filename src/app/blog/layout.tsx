import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auto Body Repair Blog — Duluth, GA Collision Tips',
  description:
    "Practical guides on collision repair, insurance claims, paintless dent repair, paint matching, and more — from Taylor's Collision, a family-owned auto body shop in Duluth, GA.",
  alternates: { canonical: 'https://taylorscollision.com/blog' },
  openGraph: {
    title: 'Auto Body Repair Blog — Taylor\'s Collision Duluth',
    description: 'Guides on collision repair, insurance claims, paint, and more — written for Duluth-area drivers.',
    url: 'https://taylorscollision.com/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}

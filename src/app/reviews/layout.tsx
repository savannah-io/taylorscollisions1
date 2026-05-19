import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reviews — 5★ Auto Body Shop in Duluth, GA',
  description:
    "Read 34+ verified 5-star reviews of Taylor's Collision in Duluth, GA. Real customer stories about our collision repair, paint work, insurance handling, and lifetime warranty.",
  alternates: { canonical: 'https://taylorscollision.com/reviews' },
  openGraph: {
    title: 'Reviews — Taylor\'s Collision Duluth, GA (5.0★)',
    description: '34+ verified 5-star Google reviews. Read what Duluth drivers say about our collision repair, paint, and customer service.',
    url: 'https://taylorscollision.com/reviews',
  },
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children
}

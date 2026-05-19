import './main.css'
import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import CursorHalo from '../components/CursorHalo'
import CursorSparks from '../components/CursorSparks'
import Schema from '../components/Schema'

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const SITE_URL = 'https://taylorscollision.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Taylor's Collision | Auto Body Repair in Duluth, GA · 5★ · Lifetime Warranty",
    template: "%s | Taylor's Collision · Duluth, GA",
  },
  description:
    "Family-owned auto body shop in Duluth, GA. Insurance-approved collision repair, free estimates, lifetime workmanship warranty, 24/7 towing. Serving Duluth, Suwanee, Johns Creek, Norcross since 2010. Call (770) 495-0050.",
  applicationName: "Taylor's Collision",
  authors: [{ name: "Taylor's Collision", url: SITE_URL }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: "Taylor's Collision",
  publisher: "Taylor's Collision",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: "Taylor's Collision",
    title: "Taylor's Collision | Auto Body Repair in Duluth, GA · 5★ · Lifetime Warranty",
    description:
      "Family-owned auto body shop in Duluth, GA. Insurance-approved collision repair, free estimates, lifetime workmanship warranty. Serving Duluth, Suwanee, Johns Creek since 2010.",
    images: [{ url: '/images/back3.jpg', width: 1920, height: 1080, alt: "Taylor's Collision shop in Duluth, GA" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Taylor's Collision | Auto Body Repair in Duluth, GA",
    description:
      "Family-owned auto body shop in Duluth, GA. Insurance-approved collision repair, free estimates, lifetime workmanship warranty.",
    images: ['/images/back3.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favi.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/favi.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <Schema />
      </head>
      <body className="antialiased bg-white font-body" suppressHydrationWarning>
        <CursorHalo />
        <CursorSparks />
        {children}
      </body>
    </html>
  )
}

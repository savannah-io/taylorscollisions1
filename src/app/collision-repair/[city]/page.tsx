import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BookingCalendar from '@/components/BookingCalendar'
import Schema, { HOMEPAGE_FAQS } from '@/components/Schema'
import { SERVICE_CITIES, type ServiceCity } from '@/lib/service-cities'
import { CheckCircleIcon, MapPinIcon, PhoneIcon, ClockIcon, StarIcon } from '@heroicons/react/24/solid'

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICE_CITIES.map((c) => ({ city: c.slug }))
}

function findCity(slug: string): ServiceCity | undefined {
  return SERVICE_CITIES.find((c) => c.slug === slug)
}

export function generateMetadata({
  params,
}: {
  params: { city: string }
}): Metadata {
  const c = findCity(params.city)
  if (!c) return {}
  const title = `Collision Repair in ${c.fullName} | Taylor's Collision — Free Estimates`
  const description = `Insurance-approved collision and auto body repair for ${c.name} drivers. ${c.milesAway} miles ${c.direction} of our Duluth shop. Free estimates, lifetime warranty, OEM parts. Call (770) 495-0050.`
  return {
    title,
    description,
    alternates: { canonical: `https://www.taylorscollision.com/collision-repair/${c.slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.taylorscollision.com/collision-repair/${c.slug}`,
    },
  }
}

const TRUST = [
  { Icon: CheckCircleIcon, t: 'Lifetime workmanship warranty' },
  { Icon: CheckCircleIcon, t: 'Direct billing with every major insurer' },
  { Icon: CheckCircleIcon, t: 'OEM parts on structural repairs' },
  { Icon: CheckCircleIcon, t: 'Free same-day written estimates' },
  { Icon: CheckCircleIcon, t: '24/7 emergency towing in Gwinnett County' },
]

export default function CityPage({
  params,
}: {
  params: { city: string }
}) {
  const c = findCity(params.city)
  if (!c) notFound()

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.taylorscollision.com' },
    { name: 'Collision Repair', url: 'https://www.taylorscollision.com/collision-repair' },
    { name: c.fullName, url: `https://www.taylorscollision.com/collision-repair/${c.slug}` },
  ]
  // Recycle the homepage FAQ pool but rewrite "Duluth" → city to keep local intent.
  const faqs = HOMEPAGE_FAQS.slice(0, 4).map((f) => ({
    question: f.question.replace('in Duluth', `for ${c.name} drivers`),
    answer: f.answer,
  }))

  return (
    <main className="min-h-screen bg-white">
      <Schema breadcrumbs={breadcrumbs} faqs={faqs} />
      <Header />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white pt-24 pb-16">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <nav aria-label="Breadcrumb" className="text-primary-300 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>Collision Repair</span>
            <span className="mx-2">/</span>
            <span className="text-white">{c.fullName}</span>
          </nav>
          <p className="font-display tracking-[0.18em] uppercase text-[0.75rem] text-primary-300 mb-3">
            <MapPinIcon className="inline w-3.5 h-3.5 mb-0.5 mr-1" />
            Serving {c.fullName} · {c.milesAway} mi {c.direction} of our Duluth shop
          </p>
          <h1 className="font-display text-white text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] mb-5">
            Collision Repair in<br />
            <span className="text-primary-300">{c.fullName}</span>
          </h1>
          <p className="text-primary-100/85 text-lg leading-relaxed max-w-2xl mb-7">{c.blurb}</p>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
            ))}
            <span className="text-white font-semibold ml-1">5.0</span>
            <span className="text-primary-200">· 140+ Google reviews</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a href="tel:+17704950050" className="btn-cta btn-cta-primary">
              <PhoneIcon className="w-4 h-4 mr-2" /> Call (770) 495-0050
            </a>
            <a href="#schedule" className="btn-cta btn-cta-ghost">Schedule a Free Estimate</a>
          </div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="py-12 bg-primary-50/40 border-y border-primary-100">
        <div className="container mx-auto px-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TRUST.map(({ Icon, t }) => (
              <li key={t} className="flex items-start gap-2.5 text-primary-900 text-[15px]">
                <Icon className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Why {city} drivers come to us ===== */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="font-display tracking-[0.16em] uppercase text-primary-600 text-sm mb-3">
              Why {c.name} drivers choose Taylor&apos;s
            </p>
            <h2 className="font-display text-primary-950 text-[clamp(1.85rem,4vw,3rem)] leading-tight mb-5">
              Closer than the big-box collision chains — and every repair carries a lifetime warranty.
            </h2>
            <p className="text-primary-900/80 leading-relaxed mb-5">
              Most of the {c.name} customers we see have already been to one of the franchise body shops and walked
              away with a number that didn&apos;t feel right. We&apos;re family-owned since 2010, we don&apos;t take
              shortcuts on structural work, and we don&apos;t pad estimates to hit a quota.
            </p>
            <p className="text-primary-900/80 leading-relaxed mb-5">
              Frequent areas we tow from: {c.landmarks.join(', ')}.
              We&apos;re inside the standard tow radius of every insurance carrier — State Farm, Geico, Allstate,
              Progressive, USAA, Liberty Mutual, Farmers, and Nationwide all direct-bill us.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-primary-600 font-semibold hover:text-primary-800"
            >
              See all services →
            </Link>
          </div>

          {/* Testimonial */}
          <figure className="bg-white rounded-2xl shadow-[0_30px_60px_-30px_rgba(2,132,199,0.3)] ring-1 ring-primary-200/60 p-7 sm:p-9 relative">
            <span className="absolute -top-3 -left-3 text-primary-500 text-7xl font-display leading-none select-none">“</span>
            <blockquote className="text-primary-900 text-[17px] leading-relaxed">
              {c.testimonial.text}
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold text-primary-900">{c.testimonial.author}</span>
              <span className="text-primary-700/70"> · {c.name} customer</span>
            </figcaption>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
              ))}
            </div>
          </figure>
        </div>
      </section>

      {/* ===== Where + Hours ===== */}
      <section className="py-12 bg-gradient-to-br from-primary-50/60 via-white to-primary-50/60">
        <div className="container mx-auto px-4 grid sm:grid-cols-3 gap-6 max-w-4xl">
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 text-primary-500 mt-1 shrink-0" />
            <div>
              <p className="font-display tracking-[0.12em] uppercase text-primary-600 text-[0.72rem] mb-1">Shop</p>
              <p className="text-primary-900 font-semibold leading-snug">2785 Buford Hwy<br />Ste 101-C<br />Duluth, GA 30096</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneIcon className="w-5 h-5 text-primary-500 mt-1 shrink-0" />
            <div>
              <p className="font-display tracking-[0.12em] uppercase text-primary-600 text-[0.72rem] mb-1">Call</p>
              <a href="tel:+17704950050" className="text-primary-900 font-semibold hover:text-primary-600">(770) 495-0050</a>
              <p className="text-primary-700/70 text-sm mt-1">Free estimates · No obligation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClockIcon className="w-5 h-5 text-primary-500 mt-1 shrink-0" />
            <div>
              <p className="font-display tracking-[0.12em] uppercase text-primary-600 text-[0.72rem] mb-1">Hours</p>
              <p className="text-primary-900 font-semibold">Mon–Fri 8:30 AM – 5:30 PM</p>
              <p className="text-primary-700/70 text-sm">Sat &amp; Sun closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Booking ===== */}
      <section id="schedule" className="py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <p className="font-display tracking-[0.16em] uppercase text-primary-600 text-sm mb-3 text-center">
            Book Your {c.name} Estimate
          </p>
          <h2 className="font-display text-primary-950 text-[clamp(2rem,5vw,3.25rem)] leading-tight mb-8 text-center">
            Pick a time — we&apos;ll handle the rest.
          </h2>
          <BookingCalendar />
        </div>
      </section>

      {/* ===== Other cities ===== */}
      <section className="py-12 bg-primary-50/40 border-t border-primary-100">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display tracking-[0.18em] uppercase text-primary-600 text-sm mb-4">
            Also serving
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {SERVICE_CITIES.filter((x) => x.slug !== c.slug).map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/collision-repair/${x.slug}`}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-primary-700 hover:text-primary-900 bg-white ring-1 ring-primary-200 hover:ring-primary-400 text-sm transition-colors"
                >
                  Collision repair in {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}

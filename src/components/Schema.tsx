/**
 * Site-wide JSON-LD structured data for Taylor's Collision.
 *
 * Emits a `@graph` payload that bundles:
 *  - LocalBusiness (AutoBodyShop subtype) — local pack + map listing
 *  - Organization — knowledge panel + sameAs fan-out
 *  - WebSite — sitelinks + searchAction
 *
 * Address must byte-match Google Business Profile or local SEO suffers.
 */

const SITE_URL = 'https://taylorscollision.com'
const PHONE = '+1-770-495-0050'
const PHONE_DISPLAY = '(770) 495-0050'
const BUSINESS_NAME = "Taylor's Collision"
const LOGO_URL = `${SITE_URL}/images/taylors-collision-logo.svg`
const HERO_IMAGE = `${SITE_URL}/images/back3.jpg`

// Duluth, GA — 2785 Buford Hwy Ste 101-C, Duluth, GA 30096
// Geo coordinates verified via address-based lookup.
const GEO = { lat: 34.001847, lng: -84.144787 }

// Service area: Gwinnett County corridor (Duluth + 15mi)
const SERVICE_AREA = [
  'Duluth, GA',
  'Suwanee, GA',
  'Johns Creek, GA',
  'Norcross, GA',
  'Berkeley Lake, GA',
  'Sugar Hill, GA',
  'Lawrenceville, GA',
  'Buford, GA',
  'Peachtree Corners, GA',
  'Tucker, GA',
]

// Services offered — each becomes a hasOfferCatalog entry.
const SERVICES = [
  { name: 'Collision Repair', description: 'Full-service collision repair with lifetime workmanship warranty. OEM parts and PPG paint systems.' },
  { name: 'Auto Body Repair', description: 'Dent removal, panel replacement, frame straightening, structural welding for cars, trucks, and SUVs.' },
  { name: 'Paintless Dent Repair', description: 'Restore your vehicle without repainting. Ideal for hail damage, door dings, and minor dents.' },
  { name: 'Auto Painting', description: 'Color-matched PPG paint refinishing. Single-panel, multi-panel, and full-vehicle repaints.' },
  { name: 'Bumper Repair & Replacement', description: 'Front and rear bumper repair, replacement, and refinishing for all makes and models.' },
  { name: 'Insurance Claims Assistance', description: 'Direct billing with all major insurers. We handle the paperwork, supplements, and approvals.' },
  { name: '24/7 Emergency Towing', description: 'After-hours towing within the Duluth and Gwinnett County area.' },
]

interface SchemaProps {
  /** Page-level breadcrumbs. If omitted, no breadcrumb schema is emitted. */
  breadcrumbs?: { name: string; url: string }[]
  /** FAQ pairs for the current page (FAQPage schema, eligible for rich results). */
  faqs?: { question: string; answer: string }[]
}

export default function Schema({ breadcrumbs, faqs }: SchemaProps = {}) {
  const graph: object[] = [
    {
      '@type': ['LocalBusiness', 'AutoBodyShop', 'AutoRepair'],
      '@id': `${SITE_URL}/#localbusiness`,
      name: BUSINESS_NAME,
      alternateName: ["Taylor's Collision Duluth", "Taylor's Auto Body"],
      description:
        "Family-owned auto body shop in Duluth, GA since 2010. Insurance-approved collision repair, free estimates, lifetime workmanship warranty, OEM parts, and PPG paint systems. Serving Duluth, Suwanee, Johns Creek, and the greater Gwinnett County area.",
      url: SITE_URL,
      logo: LOGO_URL,
      image: [HERO_IMAGE, LOGO_URL],
      telephone: PHONE,
      email: 'service@taylorscollision.com',
      priceRange: '$$',
      foundingDate: '2010',
      currenciesAccepted: 'USD',
      paymentAccepted: 'Cash, Credit Card, Debit Card, Insurance Direct Billing',
      slogan: 'Expert Auto Body Repair · Lifetime Warranty',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2785 Buford Hwy Ste 101-C',
        addressLocality: 'Duluth',
        addressRegion: 'GA',
        postalCode: '30096',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: GEO.lat,
        longitude: GEO.lng,
      },
      hasMap: `https://www.google.com/maps/place/2785+Buford+Hwy+Ste+101-C,+Duluth,+GA+30096`,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:30',
          closes: '18:00',
        },
      ],
      areaServed: SERVICE_AREA.map((name) => ({
        '@type': 'City',
        name,
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: 34,
        bestRating: 5,
        worstRating: 1,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Auto Body Services',
        itemListElement: SERVICES.map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.name,
            description: s.description,
            provider: { '@id': `${SITE_URL}/#localbusiness` },
            areaServed: SERVICE_AREA[0],
          },
        })),
      },
      knowsAbout: [
        'Collision repair',
        'Auto body repair',
        'Paintless dent repair',
        'Frame straightening',
        'Auto painting',
        'Insurance claims',
        'OEM parts',
        'PPG paint systems',
      ],
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BUSINESS_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
        width: 320,
        height: 70,
      },
      sameAs: [
        // Add real URLs once social profiles are created. Keep array even when empty
        // so the schema validates; remove the placeholder before deploying.
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: PHONE,
        contactType: 'Customer Service',
        areaServed: 'US-GA',
        availableLanguage: ['English'],
        contactOption: 'TollFree',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BUSINESS_NAME,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
    },
  ]

  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    })
  }

  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    })
  }

  const payload = {
    '@context': 'https://schema.org',
    '@graph': graph,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}

// Re-export the FAQ pool so blog posts / FAQ sections can reuse the canonical
// question text and ensure schema matches visible content.
export const HOMEPAGE_FAQS = [
  {
    question: 'Do you work with my insurance company?',
    answer:
      "Yes. We're a direct-billing shop with every major insurer — State Farm, Geico, Allstate, Progressive, USAA, Liberty Mutual, Farmers, Nationwide, and more. Under Georgia law (O.C.G.A. § 33-34-6) you have the right to choose your own body shop regardless of which 'preferred shop' your insurer recommends. We handle all the paperwork, supplements, and approvals.",
  },
  {
    question: 'How long does collision repair take in Duluth?',
    answer:
      'Most repairs at Taylor\'s Collision take between 3 days and 3 weeks depending on damage severity, parts availability, and paint cure time. Minor cosmetic work (door dings, bumper scuffs) is typically 2–4 days. Moderate damage (single-panel replacement, painting) runs 5–10 days. Major structural or frame work can take 2–3 weeks. We provide a realistic timeline in writing during your free estimate.',
  },
  {
    question: 'Is the estimate really free?',
    answer:
      'Yes — written estimates are free, same-day, no obligation, and no commitment to repair with us. Bring your vehicle to 2785 Buford Hwy Ste 101-C, Duluth GA 30096, or call (770) 495-0050 to schedule. We honor every estimate we provide.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      "Taylor's Collision is located in Duluth, GA and serves Duluth, Suwanee, Johns Creek, Norcross, Berkeley Lake, Sugar Hill, Lawrenceville, Buford, Peachtree Corners, and the surrounding Gwinnett County area. We offer free pickup and delivery within 10 miles of the shop and 24/7 emergency towing.",
  },
  {
    question: 'Does your lifetime warranty actually cover the work forever?',
    answer:
      "Yes. Our lifetime workmanship warranty covers any paint, panel, or structural repair we perform for as long as you own the vehicle. If our work fails — paint peeling, panel misalignment, structural issue — we fix it at no charge. This is in writing on every invoice.",
  },
  {
    question: 'Do you use OEM (original) parts?',
    answer:
      'Yes — we use OEM parts whenever your insurance policy allows and structural integrity requires it. We use PPG paint systems for color-matched refinishing. If your policy specifies aftermarket parts, we explain the trade-offs so you can make an informed decision before approving the work.',
  },
]

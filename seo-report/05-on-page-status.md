# 05 — On-Page SEO Status

Snapshot of what's done on the website. Last reviewed: 2026-05-20.

## Summary

The website's on-page SEO is **strong**. Search Engine Land's 2024 local-SEO ranking factors weight on-site signals at ~15% of the total — you have most of them. The remaining 85% is GBP, citations, reviews, and backlinks (covered in the other docs).

## ✅ Already in place

### Metadata
- ✅ Title tag: `Taylor's Collision | Auto Body Repair in Duluth, GA · 5★ · Lifetime Warranty`
- ✅ Meta description with location + USPs
- ✅ OpenGraph + Twitter card tags
- ✅ Canonical URLs
- ✅ Robots: `index, follow` with `max-snippet: -1`
- ✅ Favicon

### Structured data (JSON-LD)
- ✅ **LocalBusiness + AutoBodyShop + AutoRepair** schema
- ✅ **Organization** schema with NAP, logo, contactPoint
- ✅ **WebSite** schema with searchAction
- ✅ **AggregateRating**: 5.0 / 140 reviews
- ✅ **OpeningHoursSpecification**: Mon–Fri 8:30–17:30
- ✅ **GeoCoordinates**: 34.001847, -84.144787
- ✅ **AreaServed**: 10 cities in Gwinnett County
- ✅ **hasOfferCatalog**: 7 services with descriptions
- ✅ **FAQPage** schema (6 canonical Q&As, eligible for rich results)
- ✅ **BreadcrumbList** on city pages

### URL structure
- ✅ Clean, descriptive URLs: `/services`, `/contact`, `/schedule-now`, `/collision-repair/{city}`
- ✅ No query strings, IDs, or session params
- ✅ HTTPS sitewide
- ✅ www → naked redirect consistent (Vercel handles)

### Crawlability
- ✅ `sitemap.xml` includes homepage, all main pages, and city landing pages
- ✅ `robots.txt` allows full crawl
- ✅ Server-rendered (Next.js App Router) — content visible to crawlers without JS execution
- ✅ Mobile-responsive (separate mobile background + responsive hero)

### Local intent signals on content
- ✅ H1: "Expert Auto Body Repair" with eyebrow "Duluth, Georgia · Since 2010"
- ✅ Subheadline: "Insurance-approved collision & auto body repair in Duluth, GA"
- ✅ Address visible in Footer + Contact + city pages
- ✅ Phone number is `tel:` linked and visible site-wide
- ✅ Hours visible
- ✅ Service area listed
- ✅ Local landmarks named on each city page (Avalon, Suwanee Town Center, Mall of Georgia, etc.)

### Performance (matters for Google's Core Web Vitals)
- ✅ Logo: 37 KB PNG (down from 369 KB SVG)
- ✅ Background images: AVIF/WebP via Next/Image
- ✅ Dynamic imports for 3D model (lazy)
- ✅ Inter + Bebas Neue via next/font (no FOIT)
- ✅ Next.js automatic code splitting

### Pages shipped for local SEO
- ✅ `/collision-repair/suwanee`
- ✅ `/collision-repair/johns-creek`
- ✅ `/collision-repair/norcross`
- ✅ `/collision-repair/lawrenceville`
- ✅ `/collision-repair/sugar-hill`
- ✅ `/collision-repair/peachtree-corners`

Each has unique content, local landmarks, a customer testimonial keyed to that city, and the booking calendar embedded.

## ⚠️ Pending (low priority, mostly polish)

- ⚠️ **Organization `sameAs`** is empty — add real Facebook/Instagram/LinkedIn URLs once social profiles exist.
- ⚠️ **Service-specific sub-pages** — `/services/collision-repair`, `/services/paintless-dent-repair`, etc. Currently `/services` lists them all but doesn't have a unique page per service. If you want to rank for "paintless dent repair Duluth" specifically, individual pages are needed.
- ⚠️ **Blog content** — `/blog` exists but is empty. 4–8 articles on common topics ("How to file a not-at-fault insurance claim in GA", "What to do after a car accident in Duluth", "OEM vs aftermarket parts: when it matters") = long-tail traffic + topical authority.
- ⚠️ **A `/reviews` page with native reviews** — currently pulls from Supabase. Make sure each visible review has the review JSON-LD attached so Google can show stars in search.

## 🚫 Things deliberately NOT done

- ❌ No keyword-stuffed footer text ("collision repair Duluth GA collision shop near me...") — penalized.
- ❌ No hidden text or links.
- ❌ No reciprocal link schemes.
- ❌ No AI-generated city-page filler content — every blurb is hand-written and locally specific.

## How to audit yourself

Run these tests (all free, takes 5 min):
- **Rich Results Test:** https://search.google.com/test/rich-results — paste `https://www.taylorscollision.com` → confirm LocalBusiness + FAQPage detected.
- **PageSpeed Insights:** https://pagespeed.web.dev — homepage should score 85+ on mobile.
- **Mobile-Friendly Test:** Google Search Console (in the URL inspection panel).
- **Schema Validator:** https://validator.schema.org — paste the homepage URL; zero errors expected.

Re-run quarterly.

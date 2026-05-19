# Taylor's Collision — Duluth, GA Auto Body SEO Strategy

**Goal:** Rank #1–3 in Google for the highest-intent auto-body searches in Duluth and the surrounding Gwinnett County corridor (Duluth, Suwanee, Johns Creek, Norcross, Berkeley Lake, Sugar Hill, Lawrenceville, Buford). Drive 30–60 qualified estimate requests per month within 90 days, 100+ within 6 months.

The market: ~12 active body shops in the 30096–30097–30024 corridor. Most have stale GMB profiles, no on-site blogs, weak schema, no review velocity. This is a winnable race.

---

## 0. North-star metrics

| Metric | Now (estimated) | 90 days | 6 months |
|---|---|---|---|
| GMB monthly views | ~600 | 4,000 | 12,000 |
| Organic clicks/mo | ~80 | 600 | 1,800 |
| #1–3 keywords (local pack) | 0–1 | 8 | 20 |
| Reviews on GMB | 34 | 70 | 140 |
| Estimate-form submissions/mo | unknown | 30 | 100 |

Track in Google Search Console + GMB Insights + Plausible (or Vercel Analytics). Without measurement none of this matters.

---

## 1. Keyword strategy

### Tier 1 — Money keywords (commercial intent, immediate revenue)
These convert. Optimize the homepage and `/services` page first.

| Keyword | Monthly searches (Duluth metro) | Difficulty | Notes |
|---|---|---|---|
| auto body shop duluth ga | ~720 | medium | Homepage primary |
| collision repair duluth | ~480 | medium | Services page |
| body shop near me | ~5,400 (geo-modified) | high | Local pack play |
| auto body repair duluth | ~390 | low-med | Homepage variant |
| insurance body shop duluth | ~140 | low | High intent — claim filers |
| car dent repair duluth ga | ~210 | low | Service sub-page |
| fender bender repair duluth | ~70 | very low | Easy win |
| paintless dent repair duluth | ~110 | low | Service sub-page |
| auto paint shop duluth ga | ~180 | low | Service sub-page |
| bumper repair duluth | ~150 | low | Service sub-page |

### Tier 2 — Geographic expansion
Same primaries, swapped city. Each becomes its own landing page later.

- collision repair suwanee ga
- auto body shop johns creek
- collision repair norcross ga
- body shop berkeley lake
- auto body repair sugar hill ga
- collision shop lawrenceville
- body shop buford ga

### Tier 3 — Informational (blog territory — drives top-of-funnel)
These build topical authority and capture searchers BEFORE they're shopping.

- how long does collision repair take
- does my insurance cover a rental during repair
- can i choose my own body shop in georgia (yes — legally protected — high intent)
- what's the difference between OEM and aftermarket parts
- how much does it cost to fix a fender bender
- what to do after a car accident in georgia
- how to file an auto insurance claim in georgia
- do i need to get 3 estimates before repair
- can a body shop fix a frame
- how to tell if your car has frame damage

### Tier 4 — Long-tail / voice search
Increasingly important with mobile + Siri/Google Assistant.

- "best auto body shop in duluth"
- "auto body shop open near me"
- "free auto body estimate near me"
- "lifetime warranty body shop duluth"
- "family owned body shop gwinnett"

---

## 2. On-page SEO — what to fix on this site, ranked by impact

### 2.1 Metadata audit (do this week)

**Homepage** ([src/app/layout.tsx](src/app/layout.tsx)) — current title is OK but description is weak. Rewrite:

```ts
title: "Taylor's Collision | Auto Body Repair in Duluth, GA · 5★ · Lifetime Warranty"
description: "Family-owned auto body shop in Duluth, GA. Insurance-approved collision repair, free estimates, lifetime workmanship warranty, 24/7 towing. Serving Duluth, Suwanee, Johns Creek since 2010. Call (770) 495-0050."
keywords: REMOVE — Google ignores meta keywords, signals low-effort SEO
```

Per-page metadata required for /services, /reviews, /contact, /careers, /blog, /schedule. Each needs unique title + description with primary keyword in first 60 chars. Currently they probably inherit defaults — that's wasting ranking opportunities.

### 2.2 Schema markup (do this week — highest leverage)

Add JSON-LD structured data. Google uses this for the local pack, knowledge panel, rich results. Most competitors don't have it. Build a `Schema` component:

- **`LocalBusiness` + `AutoBodyShop`** (homepage): name, address, phone, hours, geo coordinates, aggregateRating (5.0 / 34 reviews), priceRange, image, sameAs (Facebook, Yelp, BBB pages), areaServed (Duluth, Suwanee, etc.)
- **`Service`** schemas on each services page sub-section (Collision Repair, Paintless Dent Repair, Auto Paint, Bumper Repair, etc.)
- **`Review`** + `aggregateRating` on /reviews (already pull from Supabase — wrap in schema)
- **`FAQPage`** on every blog post + the homepage FAQ section (we should add one)
- **`BreadcrumbList`** on internal pages

Concrete: add a `src/components/Schema.tsx` that returns `<script type="application/ld+json">` blocks. Wire it into [layout.tsx](src/app/layout.tsx). Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) and Schema.org Validator.

### 2.3 Page speed (we're already at ~91 mobile — push to 95+)

Already strong. Remaining wins:
- Move `back3.jpg` / `TC-MOBILE-BG.jpg` to AVIF-only + responsive `<picture>` (some saves)
- Lazy-load the 3D model below the fold properly (it's already dynamic-imported — verify it's not blocking LCP)
- Preconnect to fonts.googleapis.com and calendar.zoho.com
- Remove `Cursor*` components on mobile (already gated by pointer:fine, verify they don't ship JS to mobile)

### 2.4 Internal linking (currently weak)

Every blog post should link to (a) the homepage with anchor "auto body repair Duluth", (b) the relevant service page, (c) 2-3 sibling blog posts. Every service page should link back to the homepage and to /reviews. Build a footer "explore" section listing all blog posts and service pages.

### 2.5 H1/H2/H3 hierarchy

Homepage currently uses `<h1>EXPERT AUTO BODY REPAIR</h1>` — strong. But verify:
- One `<h1>` per page (and only one)
- Section headings use `<h2>` and include keywords (`<h2>Collision Repair in Duluth, GA</h2>` not `<h2>Our Services</h2>`)
- Currently a lot of `<h2>` text is generic ("Three Steps. No Surprises.") — add a keyword-anchored kicker `<h2>` above each marketing `<h2>` or change them.

### 2.6 Image alt text

Every image needs descriptive alt text. The hero image `alt=""` (line 99 of page.tsx) is decorative-correct. Logo alt is good. But future images (service shots, before/afters, blog post hero images) need alts like "Collision repair on a 2022 Honda Civic at Taylor's Collision in Duluth, GA" — not "car".

### 2.7 URL slugs

Currently fine (`/services`, `/contact`). Future blog posts should use `/blog/how-long-does-collision-repair-take` not `/blog/post-1`. Service sub-pages: `/services/collision-repair`, `/services/paintless-dent-repair`, `/services/auto-paint`.

---

## 3. Local SEO — the highest-leverage work

For a single-location auto body shop, **local pack ranking is more valuable than organic blue links.** A user searching "body shop near me" on mobile sees a map with 3 results before scrolling. Owning one of those 3 spots = 60-80% of the clicks.

### 3.1 Google Business Profile (formerly GMB) — do this week

Audit and complete every field:
- [ ] Business name: "Taylor's Collision" (no keyword stuffing — Google penalizes)
- [ ] Categories: Primary = "Auto Body Shop". Secondary = "Auto Dent Removal Service", "Auto Painting", "Auto Repair Shop"
- [ ] Hours: exact, including holidays
- [ ] Service area: Duluth + 15 mile radius
- [ ] Description: 750-character bio with primary keywords (auto body, collision repair, Duluth, insurance, lifetime warranty)
- [ ] Photos: 25+ shots — exterior, interior, team, before/afters, equipment, paint booth. Geo-tag if possible.
- [ ] Products / Services: list each service as a "service" on the profile
- [ ] Q&A: seed 8-10 common questions with answers ("Do you work with my insurance?" "Is the estimate really free?" "How long does a typical repair take?")
- [ ] Posts: weekly. Free, takes 5 min. Topics: completed jobs (anonymized), specials, tips.
- [ ] Booking link: points at the /schedule page (or directly at Zoho slot booking)

### 3.2 NAP citations (consistency battle)

Name, Address, Phone — must be byte-identical across:
- Google Business Profile
- Yelp
- BBB
- AAA (if approved shop)
- Better Business Bureau
- Bing Places
- Apple Maps Connect
- Yellow Pages
- Foursquare
- Manta
- Hotfrog
- ShowMeLocal
- Citysearch
- Local.com
- MerchantCircle

Most are free. Inconsistent NAP across these = ranking drag. Audit current state first (use a tool like Whitespark or just spot-check the top 15).

### 3.3 Review velocity

You have 34 reviews on Google at 5.0. Most competitors have 50–200. **Reviews are the #1 local pack ranking factor after proximity.** Plan:

- After every completed repair, text the customer a direct review link (Google Review link template: `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID`). This is the single highest-ROI marketing task in the shop.
- 5+ new reviews per week = ranking acceleration
- Respond to every review within 24h (positive AND negative). Public responses signal active management.
- Cross-post select reviews to Yelp + BBB. Yelp deprioritizes solicited reviews — only ask happy organic mentioners.

### 3.4 Local backlinks (the long game, but high-value)

Worth 5–10x more than generic blog backlinks for a local business:
- Duluth Chamber of Commerce member listing
- Gwinnett Chamber of Commerce
- Gwinnett County local business directory
- Duluth Daily Post (sponsor a youth sports team — link in coverage)
- Duluth High School / Peachtree Ridge HS / Berkeley Lake Elementary — sponsor or donate, get link from boosters page
- AAA Approved Auto Repair (apply if eligible — gold-tier backlink)
- I-CAR Gold Class certification page (apply if not yet certified)
- ASE certified shop directory
- Local news: pitch a "year in numbers" story to the Gwinnett Daily Post (cars repaired, insurance claims processed, etc.)

---

## 4. Blog content plan (build authority + capture informational searches)

The `/blog` route already exists. Plan: publish 1 post per week for 12 weeks, then 1–2/month maintenance. Each post is ~1,200–2,000 words, includes a featured image, schema, internal links, and a CTA to /schedule.

### Phase 1 — high-intent / fast-ranking posts (weeks 1–6)

1. **"How Long Does Collision Repair Actually Take? A Duluth Body Shop's Honest Answer"** — targets "how long does collision repair take". Talk about parts, paint cure time, insurance approval, real ranges (3 days to 3 weeks). Include FAQ schema.
2. **"Can I Choose My Own Body Shop in Georgia? (Yes — Here's the Law)"** — Georgia law explicitly says the customer chooses. Insurers can't steer. This is gold because it captures people being pressured by insurance.
3. **"Insurance Approved Body Shop in Duluth: What That Really Means"** — debunks the "preferred shop" myth. High intent.
4. **"Free Auto Body Estimates in Duluth: What to Bring & What to Expect"** — bottom-funnel.
5. **"Fender Bender Repair Cost in Georgia: What You'll Actually Pay (2026 Guide)"** — pricing transparency post. Big trust signal.
6. **"OEM vs. Aftermarket Parts in Collision Repair: Which Should You Choose?"** — pairs with insurance approval post.

### Phase 2 — geographic expansion (weeks 7–12)

7. **"Best Auto Body Shop in Suwanee, GA: Why Locals Drive 8 Minutes to Taylor's"** — gateway to ranking in Suwanee.
8. **"Collision Repair in Johns Creek: Your Guide to Insurance, Estimates & Timelines"**
9. **"Auto Body Repair in Norcross, GA: What to Know Before You Go"**
10. **"Family-Owned Body Shops in Gwinnett County: The Local Difference"**

### Phase 3 — evergreen / authority (weeks 13+)

11. **"What to Do After a Car Accident in Georgia: A 7-Step Checklist"**
12. **"How to Tell If Your Car Has Frame Damage (And What to Do About It)"**
13. **"Paintless Dent Repair vs. Traditional Body Work: When to Use Each"**
14. **"Why Your Car's Paint Won't Match (And How a Good Shop Fixes It)"**
15. **"Hail Damage Repair in Georgia: Your Insurance, Your Options"**

### Production process
Each post needs:
- 1× featured image (use AI gen + license cleared, or staged photo)
- 3–5 inline images (real shop photos — these double as GMB content)
- 1× FAQ schema block
- 1× internal link to /schedule
- 1× internal link to relevant service page
- 1× external link to authoritative source (state DMV, insurance commissioner, I-CAR)
- Author bio at bottom (Max as owner, build personal brand)

### Quick blog infrastructure to build (next session, ~3 hrs work)

- MDX support in [src/app/blog/](src/app/blog/) — currently has only `page.tsx` (index). Need `[slug]/page.tsx` dynamic route.
- Frontmatter: title, slug, description, date, author, hero image, keywords, faq.
- BlogPostLayout component (themed to site — display heading, blue accent, breadcrumb, FAQ schema, share buttons, related posts, scheduled CTA).
- Auto-generated `sitemap.xml` including all posts.
- RSS feed at `/blog/rss.xml`.
- OG image generation per-post (Vercel og-image).

---

## 5. Technical SEO — clean up the foundation

### 5.1 Missing files (add this week)

- [ ] [public/robots.txt](public/robots.txt) — allow all, point at sitemap
- [ ] `app/sitemap.ts` (Next 14 dynamic sitemap) — auto-includes /, /services, /reviews, /contact, /careers, /blog, all blog post slugs
- [ ] `app/manifest.ts` (PWA manifest) — for "add to home screen"
- [ ] OG image (`/og.png` 1200×630) for social shares — currently missing means LinkedIn / Facebook show no preview

### 5.2 Google Search Console

- [ ] Verify domain ownership (DNS TXT record or HTML tag in [layout.tsx](src/app/layout.tsx))
- [ ] Submit sitemap
- [ ] Set preferred region: United States
- [ ] Set up email alerts for crawl errors

### 5.3 Bing Webmaster Tools

Bing = 6–10% of search but easier to rank. 30-minute setup. Submit sitemap.

### 5.4 Mobile usability

Currently strong (Lighthouse mobile ~91 from prior work). Verify all touch targets ≥ 48px, tap delays ≤ 100ms, no horizontal scroll, fonts ≥ 16px (avoid auto-zoom on iOS).

### 5.5 Core Web Vitals

| Metric | Target | Current (estimated) |
|---|---|---|
| LCP | < 2.5s | ~2.1s (good) |
| INP | < 200ms | need to measure |
| CLS | 0 | 0 (good) |
| TBT | < 200ms | need to measure |

Run real-device tests on PageSpeed Insights. Fix anything yellow/red.

### 5.6 hreflang / i18n

Not yet needed. Skip until you serve Spanish-speaking customers (notable population in Gwinnett — eventual win).

---

## 6. Conversion rate optimization (SEO traffic → estimate requests)

Ranking #1 with a 1% conversion rate = same revenue as ranking #5 with a 5% conversion rate. Don't ignore CRO:

- Phone number above the fold + in the sticky header (already done — good)
- "Free Estimate · No Obligation" badge near every CTA (partially done)
- Social proof close to CTAs: "Rated 5.0★ on Google (34+ reviews)" — currently on home but should be on every page header
- Trust seals: I-CAR Gold, AAA, BBB, ASE — if you have them, show them. Especially on /services and /schedule.
- Risk reversal copy: "Lifetime warranty. If our work fails, we fix it for free, forever." — make this prominent on /schedule page
- Multi-step form psychology: the Zoho booking already does this (pick date → pick time → enter info). Mirror that on the contact form too.
- Real before/after photos. People want to see the work. Add a `/gallery` page (or merge into /services) with 20+ before/afters. SEO bonus: image search.

---

## 7. Competitive moat — what nobody else in Duluth is doing

Most local body shops are 1995-website-with-a-fresh-coat-of-paint operations. Things you can do that they likely won't:

1. **Live "shop status" widget on homepage** — "Currently working on 7 vehicles · Next available slot: Thu May 16". Generated from a real ops feed or even a simple table. Massive trust signal.
2. **Cost calculator** — interactive: "What kind of damage?" → "Where?" → ballpark range. Even rough numbers convert. (Tools: rangefinder pattern with disclaimer.)
3. **Insurance company comparison page** — "What it's like to file with [State Farm/Geico/Allstate/Progressive] in Georgia". Each one ranks for that company name + Duluth.
4. **Real customer story videos** — 60-second testimonials. Embed on /reviews. YouTube SEO bonus: each becomes a separate ranking asset.
5. **Spanish-language pages** — `/es/reparacion-de-colision-duluth`. Almost no Duluth shops have this. Gwinnett's Hispanic population is significant.
6. **AAA / I-CAR badges live on the homepage** if certified.
7. **Weekly "shop tour Saturday"** — open house. Promote via GMB Posts and local Facebook groups. Builds reviews + backlinks.

---

## 8. Paid (for when organic ramp is too slow)

Skip until budget allows, but for awareness:

- Google Local Service Ads (Auto Body category if eligible) — pay-per-lead, top of mobile results. ~$15-40/lead. Worth testing $500/mo.
- Google Search Ads on the Tier 1 keywords above. Bid on competitor names ("[competitor] reviews"). ~$3-8/click in this market.
- Facebook/Instagram retargeting — pixel anyone who visits /services or /schedule, retarget for 30 days with a "Free Estimate" offer.

Budget guidance: don't spend on paid until organic baselines are tracked, otherwise you can't attribute.

---

## 9. 30 / 60 / 90 day execution plan

### Days 1–30 (foundation week)
1. Audit + complete Google Business Profile (above)
2. Build & verify schema on homepage (LocalBusiness + AutoBodyShop)
3. Submit to Google Search Console + Bing Webmaster Tools
4. Add robots.txt + sitemap.ts
5. Rewrite homepage / services / contact metadata
6. NAP citation audit + fix top 15 inconsistencies
7. Set up review-request text automation (after every closed ticket)
8. Publish blog posts #1, #2, #3
9. Apply for AAA Approved Auto Repair, I-CAR Gold Class (if not already)

### Days 31–60 (acceleration)
10. Publish blog posts #4, #5, #6
11. Build /services/[slug] sub-pages: Collision Repair / Paintless Dent / Auto Paint / Bumper Repair (each = 800-word landing with schema + 3 internal links + CTA)
12. Add Schema FAQPage to homepage + services pages
13. Add `/gallery` with 20+ before/after images
14. First batch of GMB Posts (one per week)
15. Outreach: Duluth Chamber + Gwinnett Chamber memberships
16. Local sponsorship (HS sports team, charity event)
17. Add Spanish landing page for top service

### Days 61–90 (compound)
18. Publish posts #7–#12
19. Build geo landing pages: /collision-repair-suwanee, /collision-repair-johns-creek, /collision-repair-norcross
20. Apply for local award nominations (Best of Gwinnett, etc. — link prizes)
21. Pitch local press story (Year in Numbers)
22. Launch customer story video series
23. Audit + refresh top 3 ranking blog posts with newer data
24. Begin paid LSA test if budget permits

---

## 10. Quick wins this week (do these first)

Ordered by ROI:

1. **GMB profile completion + 7 photos** — 60 min, free, biggest single rank lift
2. **JSON-LD LocalBusiness schema on homepage** — 30 min, free, immediate rich-result eligibility
3. **Per-page metadata rewrites** — 90 min, free, captures wasted ranking opportunity
4. **Review-request text automation** — 30 min to set up, generates 3-8 new reviews/wk
5. **robots.txt + sitemap.ts** — 30 min, gets pages indexed faster
6. **NAP audit + fix Yelp/BBB/Bing** — 90 min, ranking signal
7. **Publish blog post #1 (How Long Does Collision Repair Take)** — 4 hours including images
8. **OG image** — 30 min, makes social shares actually work

Total: ~half a working week of effort, will move the needle inside 30 days.

---

## 11. What I can build in the next sessions (if you want)

- `src/components/Schema.tsx` + wire homepage schema
- `app/sitemap.ts` + `app/robots.ts`
- Blog MDX infrastructure (`src/app/blog/[slug]/page.tsx`, frontmatter parsing, ToC, related posts)
- First 3 blog posts ready to ship (with images, schema, internal links)
- `app/services/[slug]/page.tsx` dynamic service sub-pages
- OG image generator (`app/og/route.ts` via Vercel's @vercel/og)
- Review-request text template + Twilio/Resend wiring

Pick whichever order makes sense. The schema + sitemap + metadata work is the lowest-effort/highest-ROI bundle — that's where I'd start.

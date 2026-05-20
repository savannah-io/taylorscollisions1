# 02 — Google Business Profile Setup (the most important step)

GBP is the single biggest local-SEO lever. Without a verified GBP, you cannot appear in the **Local Pack** (the map with 3 listings) or **Google Maps**. With one, you can outrank competitors on review volume alone — and yours is already at 140+.

## Step 1 — Claim or create the listing

1. Go to **https://business.google.com**.
2. Sign in with the email you want to own this listing — recommend **info@taylorscollision.com** (the same one collecting bookings).
3. Search for `Taylor's Collision Duluth GA`. Two cases:
   - **Listing exists, unclaimed:** click **"Own this business?"** → start claim.
   - **No listing:** click **"Add your business to Google"**.

## Step 2 — Fill out the profile correctly

**Use these exact values — they must match the website byte-for-byte:**

```
Business name:   Taylor's Collision
Category:        Auto body shop  (primary)
                 Auto repair shop, Auto dent removal service, Auto painting  (secondary)
Address:         2785 Buford Hwy Ste 101-C
City/State/Zip:  Duluth, GA 30096
Phone:           (770) 495-0050
Website:         https://www.taylorscollision.com
Hours:           Mon–Fri 8:30 AM – 5:30 PM
                 Sat: Closed
                 Sun: Closed
```

**Description (copy this exactly — 750-char limit):**
```
Family-owned auto body shop in Duluth, GA since 2010. Insurance-approved
collision repair, free same-day estimates, lifetime workmanship warranty,
OEM parts, and PPG paint systems. Direct billing with State Farm, Geico,
Allstate, Progressive, USAA, Liberty Mutual, Farmers, and Nationwide.
Serving Duluth, Suwanee, Johns Creek, Norcross, Berkeley Lake, Sugar Hill,
Lawrenceville, Buford, and Peachtree Corners. 24/7 emergency towing in
Gwinnett County. Call (770) 495-0050 for a free estimate.
```

## Step 3 — Verify

Google will mail a **postcard** with a 5-digit verification code to your shop address. Typical timing: 5–14 days.

When it arrives:
1. Go back to **https://business.google.com**.
2. Enter the code in the verification banner.
3. Listing goes live in 1–3 days after that.

⚠️ **Do not edit the profile while waiting for the postcard** — it resets the verification clock.

## Step 4 — Optimize (after verification)

### Photos (do this within the first week)
- **Logo** — `/images/taylors-logo.png` (already on the site)
- **Cover** — outside of the shop with signage visible
- **Interior** — paint booth, customer waiting area, lift bay
- **Team** — Max + a couple of techs (with consent)
- **Before/after** — 6–10 paired shots of real repairs (great trust signal)
- **At work** — actual repairs in progress
- Target: **15–30 photos in week one**, 100+ within three months. GBPs with 100+ photos get 520% more calls.

### Services
Add each as a Service entry inside GBP (mirror the `Schema.tsx` list):
- Collision Repair
- Auto Body Repair
- Paintless Dent Repair (PDR)
- Auto Painting
- Bumper Repair & Replacement
- Insurance Claims Assistance
- 24/7 Emergency Towing

### Attributes (toggle ON)
- Wheelchair-accessible entrance — if true
- Free Wi-Fi — if you offer it
- Veteran-owned — if applicable
- Identifies as Black-owned / Asian-owned / Woman-owned — if applicable (boosts visibility in some searches)
- Online estimates — yes (you have the booking calendar)
- Onsite services — yes

### Q&A
GBP has a public Q&A section. **Seed it yourself before customers fill it with wrong info:**

Suggested seed questions (copy from the FAQ schema in `Schema.tsx` — answers already canonical):
1. Do you work with my insurance company?
2. How long does collision repair take?
3. Is the estimate really free?
4. What areas do you serve?
5. Does your lifetime warranty actually cover the work forever?
6. Do you use OEM (original) parts?

### Posts (weekly)
Google rewards "active" profiles. Post **once a week minimum**:
- Mondays: a before/after photo with caption
- Or: a new review you got
- Or: a promo ("Hail damage? Free estimate this week")
- Or: an industry tip ("How to file an insurance claim after a not-at-fault accident")

Posts expire after 7 days from the public view, so keep them coming.

### Messages
Turn on the **Messages** feature so customers can text from search results without leaving Google. Set up:
- A welcome message
- Auto-reply outside business hours pointing to the phone number

## Step 5 — Get the review-request link

After verification:
1. GBP dashboard → **"Get more reviews"**.
2. Copy the short URL — looks like `https://g.page/r/CXXX/review`.
3. Use this in every customer follow-up (see [04-reviews-playbook.md](04-reviews-playbook.md)).

## Step 6 — Monitor

Bookmark these:
- **GBP Dashboard:** https://business.google.com
- **GBP Insights** (built-in analytics) — shows how many people called from search, asked for directions, visited the website
- **Local search performance report** inside Search Console (when you connect GBP to GSC)

## Common GBP mistakes (don't do these)

| Mistake | Why it hurts |
|---|---|
| Stuffing the business name with keywords ("Taylor's Collision Duluth Auto Body") | Google penalizes & competitors will report you |
| Different NAP on website vs GBP vs Yelp | Google trusts you less; you drop in the pack |
| Using a virtual office / PO box | Google requires a real staffed location with signage |
| Posting fake reviews | Google detects clusters and can suspend the listing |
| Letting reviews go unanswered | Response rate is a known ranking factor |
| Forgetting to update hours on holidays | Tanks user trust signals |
| Multiple duplicate listings | Google merges or suspends both |

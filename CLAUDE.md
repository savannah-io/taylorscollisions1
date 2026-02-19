# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `npm run dev` (starts Next.js at `http://localhost:3000`)
- Start it in the background using Bash `run_in_background: true` before taking screenshots.
- If the server is already running on port 3000, do not start a second instance.
- Check if server is running: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`

## Screenshot Workflow
- **Use Playwright MCP tools** — `mcp__plugin_playwright_playwright__browser_navigate` and `mcp__plugin_playwright_playwright__browser_take_screenshot`
- **Always load tools first:** use `ToolSearch` with `"browser navigate playwright"` to load the tools before calling them.
- Screenshot workflow:
  1. Navigate: `mcp__plugin_playwright_playwright__browser_navigate` → `http://localhost:3000`
  2. Wait for page load if needed: `mcp__plugin_playwright_playwright__browser_wait_for`
  3. Screenshot: `mcp__plugin_playwright_playwright__browser_take_screenshot`
  4. The screenshot is returned as an image — analyze it directly without saving to disk.
- For scrolled states: use `mcp__plugin_playwright_playwright__browser_evaluate` to scroll: `window.scrollY = 400`
- For interaction states: use `mcp__plugin_playwright_playwright__browser_click` or `mcp__plugin_playwright_playwright__browser_hover`
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Project Tech Stack
- Next.js 14 (App Router) — `src/app/`
- Tailwind CSS + custom primary color (blue-based)
- Framer Motion for animations
- Supabase (postgres DB + storage) — client in `src/lib/supabase.ts`
- Nodemailer + SendGrid installed for email
- Calendly embed for appointments

## Key Files
- `src/app/page.tsx` — Homepage (reviews pulled from Supabase `/api/reviews`)
- `src/app/api/reviews/route.ts` — Reviews API (reads from Supabase `reviews` table)
- `src/app/api/notify/route.ts` — Email notification handler (contact/application/appointment)
- `src/app/api/webhooks/calendly/route.ts` — Calendly appointment webhook
- `src/app/careers/page.tsx` — Job application form → `job_applications` table
- `src/app/contact/page.tsx` — Contact form → `contact_messages` table
- `src/app/schedule-now/page.tsx` — Calendly inline booking widget
- `src/components/Header.tsx` — Main navigation

## Database Tables (Supabase)
- `reviews` — Google reviews (121 rows, imported via `reviews.sql`)
- `job_applications` — Career form submissions
- `contact_messages` — Contact form submissions

## Email Notifications (requires .env.local)
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` — SMTP credentials
- `NOTIFY_EMAIL` — Destination email for all notifications
- Calendly webhook URL: `https://taylorscollision.com/api/webhooks/calendly`

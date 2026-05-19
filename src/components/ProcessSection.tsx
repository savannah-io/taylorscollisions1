'use client'

import { motion } from 'framer-motion'
import {
  PhoneArrowUpRightIcon,
  WrenchScrewdriverIcon,
  KeyIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline'

const STEPS = [
  {
    n: '01',
    Icon: PhoneArrowUpRightIcon,
    title: 'Free Estimate',
    body:
      'Call (770) 495-0050 or book online. We give you a written estimate the same day — no obligation, no surprise fees.',
  },
  {
    n: '02',
    Icon: WrenchScrewdriverIcon,
    title: 'We Handle Insurance',
    body:
      'We work directly with all major insurers — paperwork, claims, supplements. You drive off, we coordinate the rest.',
  },
  {
    n: '03',
    Icon: KeyIcon,
    title: 'Repair · Pickup',
    body:
      'Lifetime warranty on workmanship. Free pickup/delivery within 10 mi. Text updates the whole way through.',
  },
]

const NUMBERS = [
  { value: '15+', label: 'Years', sub: 'Serving Duluth since 2010' },
  { value: '5.0★', label: 'Google', sub: '34+ verified reviews' },
  { value: 'Lifetime', label: 'Warranty', sub: 'Workmanship guarantee' },
  { value: '24/7', label: 'Towing', sub: 'Emergency hotline' },
]

const PROMISES = [
  'OEM parts + PPG paint systems',
  'Direct insurance billing — no chasing',
  'Free pickup & delivery within 10 mi',
  'Live status updates by text',
]

const BRAND_BLUE = '#0ea5e9'

export default function ProcessSection() {
  return (
    <section
      className="relative overflow-hidden text-white py-20 sm:py-28"
      style={{ background: '#06121f' }}
    >
      {/* SVG noise grain — ports Javier's NoiseGrain component */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.28,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
        }}
      />

      {/* Soft blue halo — ports Javier's RedHaloGradient in blue */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(14,165,233,0.22) 0%, rgba(14,165,233,0.08) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      {/* Top accent stripe (Javier: 1.5 solid red band) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: BRAND_BLUE }}
      />

      {/* Bottom diagonal road-stripe (Javier: .diag-stripe at bottom edge) */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0"
        style={{
          height: 6,
          opacity: 0.85,
          backgroundImage: `repeating-linear-gradient(45deg, ${BRAND_BLUE} 0 12px, transparent 12px 24px)`,
        }}
      />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT — Headline + Steps */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-5"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: BRAND_BLUE, boxShadow: `0 0 12px ${BRAND_BLUE}` }}
              />
              <span className="stat-label" style={{ color: BRAND_BLUE }}>
                How it works
              </span>
            </motion.div>

            <motion.h2
              className="font-display text-white text-[clamp(2.5rem,7vw,5rem)] leading-[0.88] mb-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Three Steps.
            </motion.h2>
            <motion.h2
              className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.88] mb-5"
              style={{ color: BRAND_BLUE, textShadow: `0 0 32px rgba(14,165,233,0.35)` }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
            >
              No Surprises.
            </motion.h2>

            <motion.p
              className="text-white/75 leading-relaxed max-w-lg mb-10 text-[15px] sm:text-base"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
            >
              You call. We estimate. We handle the rest — including the insurance paperwork. You drive
              off with a like-new vehicle and a lifetime workmanship warranty.
            </motion.p>

            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i }}
                  className="group relative flex items-start gap-5 rounded-2xl p-5 sm:p-6 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <span
                    className="shrink-0 inline-flex items-center justify-center font-display text-2xl rounded-xl tracking-wider"
                    style={{
                      width: 56,
                      height: 56,
                      background:
                        'linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0.04) 100%)',
                      color: BRAND_BLUE,
                      border: '1px solid rgba(14,165,233,0.28)',
                    }}
                  >
                    {step.n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <step.Icon className="w-5 h-5 shrink-0" style={{ color: BRAND_BLUE }} />
                      <h3 className="font-display tracking-[0.06em] text-white text-xl sm:text-2xl uppercase">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-white/75 leading-relaxed text-[14.5px] sm:text-[15px]">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT — By The Numbers + Promises */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-1"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: BRAND_BLUE }} />
              <span className="stat-label" style={{ color: BRAND_BLUE }}>
                By the numbers
              </span>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {NUMBERS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i }}
                  className="rounded-2xl px-5 py-5 sm:px-6 sm:py-6 transition-colors duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <p
                    className="font-display leading-none mb-3"
                    style={{
                      fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                      color: BRAND_BLUE,
                      textShadow: `0 0 24px rgba(14,165,233,0.45)`,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="font-display tracking-[0.08em] text-white text-base uppercase">
                    {stat.label}
                  </p>
                  <p className="stat-label mt-1.5 text-white/55" style={{ letterSpacing: '0.12em' }}>
                    {stat.sub}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl px-5 py-5 sm:px-6 sm:py-6"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <p className="stat-label mb-4" style={{ color: BRAND_BLUE }}>
                What you get on every job
              </p>
              <ul className="space-y-2.5">
                {PROMISES.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND_BLUE }} />
                    <span className="text-white/85 text-[14.5px] leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

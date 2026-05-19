'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { StarIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { motion, useReducedMotion } from 'framer-motion'
import { TextGenerateEffect } from '../components/ui/text-generate-effect'
import ServiceGrid from '../components/ServiceGrid'
import Image from 'next/image'
import ProcessSection from '../components/ProcessSection'
import StripeDivider from '../components/StripeDivider'
import BookingCalendar from '../components/BookingCalendar'

const AmbientField = dynamic(() => import('../components/AmbientField'), {
  ssr: false,
  loading: () => null,
})

const HeroCarModel = dynamic(() => import('../components/HeroCarModel'), {
  ssr: false,
  loading: () => null,
})

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement | null;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
        branding?: boolean;
      }) => void;
    };
  }
}

const FALLBACK_REVIEWS = [
  {
    text: "Max and the team did an incredible job on my 2020 Mazda CX-30. I'm extremely happy with the results and would recommend them to everyone!",
    author: "Jarrett B.",
    rating: 5
  },
  {
    text: "The owner Max was AMAZING!! His work is top notch! I think my vehicle actually looks better than it did before I had the accident!",
    author: "Jordan P.",
    rating: 5
  },
  {
    text: "Had a door out of alignment and Max fixed it in just a few minutes. No appointment. Just rolled in off the street. Great place.",
    author: "Rob G.",
    rating: 5
  }
]

const HERO_STATS = [
  { value: '5.0★', label: 'Google' },
  { value: '34+', label: 'Reviews' },
  { value: 'LIFETIME', label: 'Warranty' },
  { value: 'FREE', label: 'Estimates' },
]

const TRUST_BADGES = [
  { value: 'LIFETIME', label: 'WARRANTY' },
  { value: 'FREE', label: 'ESTIMATES' },
  { value: 'INSURANCE', label: 'APPROVED' },
  { value: '24/7', label: 'TOWING' },
]

export default function Home() {
  const [previewReviews, setPreviewReviews] = useState(FALLBACK_REVIEWS)
  const reduceMotion = useReducedMotion()

  // Mobile headline lockup: words rise out of a mask, staggered.
  const hlContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.18 } },
  }
  const hlWord = {
    hidden: reduceMotion ? { opacity: 0 } : { y: '120%' },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  useEffect(() => {
    fetch('/api/reviews?page=1&pageSize=3')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.reviews?.length) {
          setPreviewReviews(data.reviews.map((r: { text: string; author_name: string; rating: number }) => ({
            text: r.text,
            author: r.author_name,
            rating: r.rating
          })))
        }
      })
      .catch(() => {/* keep fallback */})
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* ============ HERO ============ */}
      <section className="hero-section">
        {/* Background photo — pre-compressed JPGs; Next further serves AVIF/WebP */}
        <Image
          src="/images/back3.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 100vw, 0px"
          quality={75}
          className="object-cover object-center pointer-events-none select-none hidden md:block"
        />
        <Image
          src="/images/TC-MOBILE-BG.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 0px"
          quality={72}
          className="object-cover object-center pointer-events-none select-none md:hidden"
        />
        {/* Base scene darken — keeps the shop photo visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/55 via-primary-900/45 to-primary-950/70 pointer-events-none" />
        {/* Side gradient — heavier on the left so the headline reads cleanly,
            lighter on the right so the Sketchfab tile pops */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/40 to-transparent pointer-events-none" />
        {/* Bottom anchor — slight darken at bottom for stats legibility */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-primary-950/85 to-transparent pointer-events-none" />

        {/* Ambient particle field on the hero too — very subtle */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <AmbientField tone="dark" count={60} opacity={0.45} beams={false} />
        </div>

        <div className="container relative z-20 w-full">
          <div className="hero-grid">
            {/* HEADLINE block */}
            <motion.div
              className="hero-headline hero-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
                className="hero-eyebrow inline-flex items-center gap-3 mb-2 sm:mb-3"
              >
                <span className="hero-eyebrow-dash block w-7 h-px bg-primary-300/70" />
                <span className="stat-label text-primary-200">Duluth, Georgia · Since 2010</span>
              </motion.div>

              <h1
                className="font-display text-white leading-[0.86] tracking-[0.005em] drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
                aria-label="Expert Auto Body Repair in Duluth, GA"
              >
                {/* Desktop / large screens — unchanged */}
                <span className="hidden lg:block" aria-hidden>
                  <TextGenerateEffect words="EXPERT" className="text-white block hero-line hero-line-tall" duration={0.3} />
                  <span className="block hero-line hero-line-wide">AUTO BODY</span>
                  <span className="block text-primary-300 hero-line hero-line-tall">REPAIR</span>
                </span>

                {/* Mobile / tablet — sculpted editorial lockup */}
                <motion.span
                  className="hl-m block lg:hidden"
                  variants={hlContainer}
                  initial="hidden"
                  animate="visible"
                  aria-hidden
                >
                  <span className="hl-glow" aria-hidden />
                  <span className="hl-clip">
                    <motion.span className="hl-word hl-expert" variants={hlWord}>EXPERT</motion.span>
                  </span>
                  <span className="hl-clip hl-clip-kicker">
                    <motion.span className="hl-kicker" variants={hlWord}>
                      <span className="hl-rule" />
                      AUTO&nbsp;BODY
                      <span className="hl-rule" />
                    </motion.span>
                  </span>
                  <span className="hl-clip">
                    <motion.span className="hl-word hl-repair" variants={hlWord}>REPAIR</motion.span>
                  </span>
                </motion.span>
              </h1>
            </motion.div>

            {/* 3D MODEL block — DESKTOP ONLY. Mobile version lives inside the
                CTA interstitial section below. */}
            <motion.div
              className="hero-model-wrap hero-model hidden lg:block"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              aria-hidden
            >
              <div className="hero-model-inner">
                <HeroCarModel rotateSpeed={0.6} />

                {/* Soft floor glow — behind, doesn't block pointer */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-500/35 via-primary-500/10 to-transparent blur-2xl pointer-events-none z-0" />

                {/* Corner brackets — viewport / target-lock feel */}
                <CornerBrackets />

                {/* Top-left status badge */}
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-950/55 backdrop-blur-sm ring-1 ring-primary-300/30 text-primary-50 text-[10px] font-bold tracking-[0.2em] uppercase pointer-events-none z-20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-300 animate-pulse" />
                  Live 3D
                </motion.div>

                {/* Top-right axis-tick / view indicator */}
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  style={{ position: 'absolute', top: '0.85rem', right: '0.85rem' }}
                  className="text-primary-100/80 text-[10px] font-bold tracking-[0.22em] uppercase pointer-events-none z-20"
                >
                   · Interactive
                </motion.div>

                {/* Drag-to-rotate chip — wrapped in plain div so framer-motion
                    can't clobber our centering transform. */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '1.25rem',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    pointerEvents: 'none',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500 shadow-[0_12px_30px_-8px_rgba(2,132,199,0.8)] ring-1 ring-primary-300/60 text-white text-[11px] font-bold tracking-[0.2em] uppercase whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M5 12l4-4" />
                      <path d="M5 12l4 4" />
                      <path d="M19 12l-4-4" />
                      <path d="M19 12l-4 4" />
                    </svg>
                    Drag to rotate
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* CTAs block — subhead + buttons. Mobile order: directly under headline. */}
            <motion.div
              className="hero-rest hero-content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {/* Desktop: single run-on line. Hidden on mobile in favor of chips. */}
              <motion.p
                className="hidden lg:block font-display text-white/85 text-[clamp(0.78rem,1.7vw,1.15rem)] tracking-[0.16em] mt-3 sm:mt-5 mb-4 sm:mb-6"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                Lifetime warranty · Insurance approved · Free estimates
              </motion.p>

              {/* Mobile: a real supporting line — professional, keyword-rich
                  for local SEO (replaces the old pill chips). */}
              <motion.p
                className="hero-subhead-m lg:hidden"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Insurance-approved <strong>collision &amp; auto body repair</strong> in
                Duluth, GA — backed by a lifetime warranty and free estimates.
              </motion.p>

              <motion.div
                className="hero-cta-row flex flex-row gap-2.5 sm:gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <motion.a
                  href="#schedule"
                  onClick={(e) => { e.preventDefault(); document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-cta btn-cta-primary"
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule Estimate
                </motion.a>
                <motion.a
                  href="/contact"
                  className="btn-cta btn-cta-ghost group"
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Contact Us</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Stats block — split out so it can sit BELOW the 3D model on mobile. */}
            <motion.div
              className="hero-stats hero-content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-white/15 grid grid-cols-4 gap-x-3 sm:gap-x-5">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-display text-white text-[clamp(1rem,2.8vw,1.85rem)] leading-none">{stat.value}</span>
                    <span className="stat-label mt-1 text-[0.58rem] sm:text-[0.7rem]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile-only scroll cue — signals there's more below the fold. */}
        <button
          type="button"
          aria-label="See our work — scroll down"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          className="hero-scroll-cue lg:hidden"
        >
          <span className="hero-scroll-label">See Our Work</span>
          <span className="hero-scroll-track" aria-hidden>
            <span className="hero-scroll-dot" />
          </span>
        </button>

      </section>

      {/* ============ CTA INTERSTITIAL ============ */}
      <section className="relative overflow-hidden py-16 sm:py-20 text-center bg-gradient-to-br from-primary-500 via-primary-400 to-primary-500">
        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.55) 40px, rgba(255,255,255,0.55) 80px)',
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-white/15 blur-3xl pointer-events-none" />

        <div className="container relative">
          <motion.p className="stat-label text-primary-100 mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Free. Fast. No Obligation.
          </motion.p>
          <motion.h2
            className="font-display text-white text-[clamp(2.5rem,7.5vw,5.5rem)] leading-[0.88] mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready To Get
            <br />
            <span className="text-primary-200">Your Car Fixed?</span>
          </motion.h2>

          {/* MOBILE-ONLY 3D model — relocated from the hero so the hero stays
              text-focused on phones. Lives here, inside the CTA interstitial. */}
          <motion.div
            className="lg:hidden mx-auto mb-8 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            aria-hidden
          >
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-950/70 via-primary-900/60 to-primary-950/70 ring-1 ring-white/25 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]">
              <HeroCarModel rotateSpeed={0.6} />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-500/35 via-primary-500/10 to-transparent blur-2xl pointer-events-none z-0" />
              <CornerBrackets />

              <div
                style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-950/65 backdrop-blur-sm ring-1 ring-primary-300/30 text-primary-50 text-[10px] font-bold tracking-[0.2em] uppercase pointer-events-none z-20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-300 animate-pulse" />
                Live 3D
              </div>

              <div
                style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
                className="text-primary-100/85 text-[10px] font-bold tracking-[0.22em] uppercase pointer-events-none z-20"
              >
                · Interactive
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '1rem',
                  transform: 'translateX(-50%)',
                  zIndex: 20,
                  pointerEvents: 'none',
                }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500 shadow-[0_12px_30px_-8px_rgba(2,132,199,0.8)] ring-1 ring-primary-300/60 text-white text-[11px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M5 12l4-4" />
                    <path d="M5 12l4 4" />
                    <path d="M19 12l-4-4" />
                    <path d="M19 12l-4 4" />
                  </svg>
                  Drag to rotate
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <a href="tel:+17704950050" className="btn-cta bg-white text-primary-700 hover:bg-primary-50">
              Call (770) 495-0050
            </a>
            <a
              href="#schedule"
              onClick={(e) => { e.preventDefault(); document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-cta btn-cta-ghost"
            >
              Book Online ↓
            </a>
          </motion.div>
        </div>

      </section>

      {/* ============ PROCESS / NUMBERS ============ */}
      {/* ProcessSection has its own top accent + bottom diag-stripe baked in. */}
      <ProcessSection />

      {/* ============ BOOKING ============ */}
      <section id="schedule" className="relative overflow-hidden bg-gradient-to-br from-primary-50/60 via-white to-primary-50/60 py-16 sm:py-24 grain">
        <AmbientField tone="light" />
        <div className="container relative z-10">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-primary-50 ring-1 ring-primary-200/70"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              <span className="stat-label text-primary-700">Book Your Service</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-primary-950 text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.9] mb-4"
            >
              Schedule Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                  Auto Estimate
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-2.5 bg-primary-200/60 -rotate-1" />
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-primary-900/70 leading-relaxed max-w-xl mx-auto"
            >
              Book your appointment with our expert technicians. We&apos;ll get your vehicle back to its best condition.
            </motion.p>
          </div>

          {/* Unified booking — custom, fully responsive, request-based.
              Replaces the non-mobile-responsive Zoho slot-booking widget;
              every booking CTA on the site funnels here. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <BookingCalendar />
          </motion.div>
        </div>

      </section>

      {/* ============ TRUST BAND ============ */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 80px)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full bg-primary-300/20 blur-3xl" />
        </div>
        <div className="container relative">
          <motion.p
            className="stat-label text-primary-300 text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Guarantee
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 max-w-5xl mx-auto">
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <p className="font-display text-white text-[clamp(1.75rem,5vw,3rem)] leading-none">{badge.value}</p>
                <p className="stat-label mt-2.5">{badge.label}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-16 pt-12 border-t border-primary-700/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/95 rounded-2xl px-6 py-4 shadow-[0_18px_40px_-18px_rgba(2,132,199,0.35)] ring-1 ring-white/40">
              <Image src="/images/PPG.png" alt="PPG Certified" width={300} height={300} className="object-contain h-20 sm:h-24 w-auto" />
            </div>
            <a
              href="https://www.bbb.org/us/ga/duluth/profile/auto-body-repair-and-painting/taylors-collision-center-0443-6007405"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 rounded-2xl px-6 py-4 shadow-[0_18px_40px_-18px_rgba(2,132,199,0.35)] ring-1 ring-white/40 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Image src="/images/BBB.png" alt="Better Business Bureau" width={300} height={300} className="object-contain h-20 sm:h-24 w-auto" />
            </a>
          </motion.div>
        </div>

      </section>

      <StripeDivider />

      {/* ============ SERVICES OVERVIEW ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/60 via-white to-primary-50/60 py-20 sm:py-28 grain">
        <AmbientField tone="light" />
        <div className="container relative pt-2">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="stat-label text-primary-600 mb-3 block">Our Expertise</span>
            <h2 className="font-display text-primary-950 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.88] mb-5">
              What We Fix.
            </h2>
            <motion.p
              className="text-base sm:text-lg text-primary-900/70 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              From collision repair and dent removal to expert paint matching and structural repairs — we handle it all.
            </motion.p>
          </motion.div>

          <ServiceGrid />

          <div className="text-center mt-12">
            <motion.a
              href="/services"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 group relative overflow-hidden"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative">Explore Our Services</span>
              <ArrowRightIcon className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>

      </section>

      {/* ============ REVIEWS PREVIEW ============ */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-white/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary-300/20 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="mb-14">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
              <Image src="/google.svg" alt="Google" width={18} height={18} className="w-4 h-4" />
              <span className="stat-label text-white">Verified Google Reviews</span>
              <svg className="w-4 h-4 text-primary-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <motion.h2
              className="font-display text-white text-[clamp(2.5rem,7vw,5rem)] leading-[0.88] mb-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Our
              <br />
              <span className="text-primary-300">Customers Say.</span>
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-primary-100/90 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              We&apos;re committed to excellence on every repair.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {previewReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/8 backdrop-blur-sm rounded-xl p-6 border-l-4 border-l-primary-300 border border-white/10 hover:bg-white/12 transition-colors duration-300"
              >
                <div className="flex text-yellow-400 mb-4 gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
                <p className="text-white/90 mb-5 leading-relaxed text-[15px]">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-medium text-sm">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{review.author}</p>
                    <p className="text-xs text-primary-200/70">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.a
              href="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm rounded-lg text-white font-medium text-sm transition-colors duration-200 group"
              whileHover={{ y: -2 }}
            >
              View All Reviews
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

/* Corner L-brackets for the hero-model tile — gives the 3D viewer a target-lock vibe */
function CornerBrackets() {
  const arm = 'absolute w-5 h-5 pointer-events-none z-10'
  const top = 'border-t-2 border-primary-300/70'
  const bottom = 'border-b-2 border-primary-300/70'
  const left = 'border-l-2 border-primary-300/70'
  const right = 'border-r-2 border-primary-300/70'
  return (
    <>
      <div className={`${arm} ${top} ${left}`} style={{ top: 8, left: 8 }} />
      <div className={`${arm} ${top} ${right}`} style={{ top: 8, right: 8 }} />
      <div className={`${arm} ${bottom} ${left}`} style={{ bottom: 8, left: 8 }} />
      <div className={`${arm} ${bottom} ${right}`} style={{ bottom: 8, right: 8 }} />
    </>
  )
}

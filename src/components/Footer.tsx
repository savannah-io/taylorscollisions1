'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { usePrivacyPolicy, useTermsOfService } from './PolicyModals'
import Image from 'next/image'

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
  </svg>
)
const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const TwitterXIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const SOCIAL = [
  { Icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
  { Icon: TwitterXIcon, href: 'https://x.com', label: 'X' },
]

const QUICK_LINKS: Array<[string, string]> = [
  ['Schedule Now', '/#schedule'],
  ['Services', '/services'],
  ['Reviews', '/reviews'],
  ['Contact', '/contact'],
]

const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-display tracking-[0.18em] uppercase text-[0.8rem] text-primary-600 mb-5 flex items-center gap-2">
    <span className="block w-6 h-px bg-primary-400/70" />
    {children}
  </h3>
)

export default function Footer() {
  const { openPrivacyPolicy, PrivacyPolicyModal } = usePrivacyPolicy()
  const { openTermsOfService, TermsOfServiceModal } = useTermsOfService()

  return (
    <footer className="relative w-full bg-white text-primary-950 overflow-hidden">
      {/* Soft decorative wash — very subtle, keeps it bright */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] bg-primary-100/40 rounded-full blur-3xl" />
      </div>

      {/* Top callout band — separator from the section above */}
      <div className="relative bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 py-8">
            <div className="text-center md:text-left">
              <p className="font-display tracking-[0.18em] uppercase text-[0.7rem] text-white/85">Ready when you are</p>
              <p className="font-display text-white text-[clamp(1.4rem,3vw,2.1rem)] leading-tight tracking-wide mt-1">
                Bring it in, get it back better than new.
              </p>
            </div>
            <Link
              href="/#schedule"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md font-display tracking-[0.14em] uppercase text-[0.92rem] bg-white text-primary-700 hover:bg-primary-50 transition-colors shadow-[0_18px_36px_-12px_rgba(2,132,199,0.45)] whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault()
                if (typeof window !== 'undefined' && window.location.pathname === '/') {
                  document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  window.location.href = '/#schedule'
                }
              }}
            >
              Schedule Estimate
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Image
              src="/images/taylors-collision-logo.svg"
              alt="Taylor's Collision"
              width={496}
              height={111}
              className="h-auto w-[230px] object-contain mb-5"
            />
            <p className="text-primary-900/75 leading-relaxed text-[15px] mb-6 max-w-sm">
              A trusted Duluth auto body shop dedicated to excellence in collision repair and customer service since 2010.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 hover:bg-primary-500 text-primary-600 hover:text-white ring-1 ring-primary-200 hover:ring-primary-500 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-primary-900/85 hover:text-primary-600 transition-colors text-[15px]"
                  >
                    <span className="block w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <FooterHeading>Visit</FooterHeading>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="https://www.google.com/maps/place/2785+Buford+Hwy+Ste+101-C,+Duluth,+GA+30096"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-primary-900/85 hover:text-primary-600 transition-colors"
                >
                  <span className="mt-0.5 inline-flex w-7 h-7 rounded-full bg-primary-50 ring-1 ring-primary-200 items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:ring-primary-500 group-hover:text-white transition-colors">
                    <MapPinIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[15px] leading-snug">
                    2785 Buford Hwy Ste 101-C
                    <br />
                    Duluth, GA 30096
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:+17704950050" className="group flex items-center gap-3 text-primary-900/85 hover:text-primary-600 transition-colors">
                  <span className="inline-flex w-7 h-7 rounded-full bg-primary-50 ring-1 ring-primary-200 items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:ring-primary-500 group-hover:text-white transition-colors">
                    <PhoneIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold text-[15px]">(770) 495-0050</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@taylorscollision.com" className="group flex items-center gap-3 text-primary-900/85 hover:text-primary-600 transition-colors">
                  <span className="inline-flex w-7 h-7 rounded-full bg-primary-50 ring-1 ring-primary-200 items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:ring-primary-500 group-hover:text-white transition-colors">
                    <EnvelopeIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[15px]">info@taylorscollision.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours + Careers */}
          <div className="md:col-span-3">
            <FooterHeading>Hours</FooterHeading>
            <div className="rounded-xl bg-primary-50/70 ring-1 ring-primary-100 px-4 py-3.5 mb-4">
              <div className="flex items-center gap-2 mb-2.5">
                <ClockIcon className="w-4 h-4 text-primary-600" />
                <span className="text-xs font-semibold tracking-wider uppercase text-primary-700">Schedule</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-primary-900/80">Mon – Fri</span>
                  <span className="text-primary-700 font-semibold">8:30a – 6:00p</span>
                </div>
                <div className="flex justify-between items-center text-[14px] pt-1.5 border-t border-primary-200/60">
                  <span className="text-primary-900/80">Sat – Sun</span>
                  <span className="text-primary-500 font-medium">Closed</span>
                </div>
              </div>
            </div>
            <Link
              href="/careers"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary-50 hover:bg-primary-500 text-primary-700 hover:text-white ring-1 ring-primary-200 hover:ring-primary-500 transition-all duration-200 text-sm font-semibold tracking-wide"
            >
              <UserGroupIcon className="w-4 h-4" />
              Join Our Team
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7 border-t border-primary-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-primary-900/55 text-[13px]">
              © {new Date().getFullYear()} Taylor&apos;s Collision · All rights reserved
            </p>
            <div className="flex items-center gap-6">
              <button onClick={openPrivacyPolicy} className="text-primary-900/55 hover:text-primary-600 transition-colors text-[13px]">
                Privacy Policy
              </button>
              <span className="w-px h-3 bg-primary-200" />
              <button onClick={openTermsOfService} className="text-primary-900/55 hover:text-primary-600 transition-colors text-[13px]">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      <PrivacyPolicyModal />
      <TermsOfServiceModal />
    </footer>
  )
}

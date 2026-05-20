'use client'

import Link from 'next/link'
import { PhoneIcon, MapPinIcon, Bars3Icon, XMarkIcon, ClockIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50">
      {/* Announcement / contact bar — desktop */}
      <div className="announce-bar w-full hidden md:block">
        <div className="container mx-auto px-4">
          <div className="h-8 flex items-center justify-between text-[12.5px]">
            <div className="flex items-center gap-6">
              <a href="tel:+17704950050" className="group flex items-center gap-2 hover:text-primary-100 transition-colors">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <PhoneIcon className="h-3 w-3" />
                </span>
                <span className="font-semibold tracking-wide">(770) 495-0050</span>
              </a>
              <span className="w-px h-4 bg-white/25" />
              <a
                href="https://www.google.com/maps/place/2785+Buford+Hwy+Ste+101-C,+Duluth,+GA+30096"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 hover:text-primary-100 transition-colors"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <MapPinIcon className="h-3 w-3" />
                </span>
                <span className="font-medium tracking-wide">2785 Buford Hwy Ste 101-C, Duluth, GA 30096</span>
              </a>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 ring-1 ring-white/15">
              <ClockIcon className="h-3 w-3 text-primary-100" />
              <span className="text-[12.5px] font-semibold tracking-wide">Mon–Fri · 8:30 AM – 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement bar — mobile compact (phone + free estimate pill) */}
      <div className="announce-bar w-full md:hidden">
        <div className="container mx-auto px-3">
          <div className="h-[26px] flex items-center justify-between text-[11.5px]">
            <a href="tel:+17704950050" className="flex items-center gap-1.5 font-semibold tracking-wide">
              <PhoneIcon className="h-3 w-3" />
              <span>(770) 495-0050</span>
            </a>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 ring-1 ring-white/15 font-semibold tracking-[0.14em] uppercase text-[10.5px]">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Free Estimates
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur shadow-[0_8px_24px_-12px_rgba(2,132,199,0.18)]' : 'bg-white md:bg-white/97 md:backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-12 md:h-16">
            <Link href="/" className="relative group shrink-0">
              <Image
                src="/images/taylors-collision-logo.svg"
                alt="Taylor's Collision"
                width={496}
                height={111}
                priority
                className="h-auto w-[155px] sm:w-[200px] md:w-[250px] object-contain"
              />
            </Link>

            <div className="hidden md:flex items-center gap-7 ml-auto mr-7">
              {NAV_ITEMS.map((item) => (
                <Link key={item.label} href={item.href} className={`nav-link ${isActive(item.href) ? 'active' : ''}`}>
                  {item.label}
                </Link>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="hidden md:block">
              <Link
                href="/#schedule"
                className="inline-flex items-center justify-center h-11 px-6 rounded-md font-display tracking-[0.14em] uppercase text-[0.92rem] text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-[0_12px_28px_-12px_rgba(2,132,199,0.55)] hover:shadow-[0_18px_36px_-12px_rgba(2,132,199,0.7)] transition-shadow"
                onClick={(e) => {
                  e.preventDefault()
                  if (window.location.pathname === '/') {
                    document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    window.location.href = '/#schedule'
                  }
                }}
              >
                Schedule Now
              </Link>
            </motion.div>

            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-primary-700 hover:bg-primary-50 active:bg-primary-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col"
            >
              <div className="px-5 pt-5 pb-4 border-b border-primary-100">
                <Link href="/">
                  <Image src="/images/taylors-collision-logo.svg" alt="Taylor's Collision" width={496} height={111} priority className="h-auto w-[180px] object-contain" />
                </Link>
              </div>

              <nav className="flex-1 px-3 py-4">
                <ul className="flex flex-col space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`block px-3 py-2.5 rounded-lg font-display tracking-[0.14em] uppercase text-base transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-primary-900 hover:bg-primary-50/70 hover:text-primary-600'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-primary-100 bg-gradient-to-b from-primary-50/40 to-white px-5 py-4 space-y-3">
                <a href="tel:+17704950050" className="flex items-center gap-3 text-primary-900 hover:text-primary-600 transition-colors">
                  <PhoneIcon className="h-4 w-4 text-primary-600" />
                  <span className="font-semibold text-sm">(770) 495-0050</span>
                </a>
                <div className="flex items-center gap-3 text-primary-900/70">
                  <ClockIcon className="h-4 w-4 text-primary-600" />
                  <span className="text-xs font-medium">Mon–Fri · 8:30 AM – 6:00 PM</span>
                </div>
                <Link
                  href="/#schedule"
                  className="w-full inline-flex items-center justify-center h-11 px-6 rounded-md font-display tracking-[0.14em] uppercase text-[0.92rem] text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-[0_12px_28px_-12px_rgba(2,132,199,0.55)] mt-1"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMobileMenuOpen(false)
                    if (window.location.pathname === '/') {
                      document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })
                    } else {
                      window.location.href = '/#schedule'
                    }
                  }}
                >
                  Schedule Now
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header

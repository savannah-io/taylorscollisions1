'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { StarIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { TextGenerateEffect } from '../components/ui/text-generate-effect'
import ServiceGrid from '../components/ServiceGrid'
import Image from 'next/image'
import MouseFollowGradient from '../components/MouseFollowGradient'
import Script from 'next/script'

// Add Calendly type declaration
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

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <MouseFollowGradient variant="dark" opacity={0.8} />
        {/* Main overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-primary-900/65 to-primary-800/70 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800/30 to-transparent pointer-events-none"></div>
        
        {/* Tech pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
            style={{ 
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 8%),
                radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 6%),
                radial-gradient(circle at 40% 70%, rgba(56, 189, 248, 0.15) 0%, transparent 12%),
                radial-gradient(circle at 70% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 10%),
                linear-gradient(to bottom right, transparent 0%, transparent 100%)
              `,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat'
            }}>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
          <motion.div 
            className="hero-content max-w-3xl md:py-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-heading text-[clamp(3rem,9vw,7.5rem)] text-white drop-shadow-2xl mb-2">
              <TextGenerateEffect
                words="EXPERT AUTO"
                className="text-white block"
                duration={0.3}
              />
              <span className="block">BODY REPAIR</span>
            </h1>
            <motion.p
              className="display-heading text-[clamp(1.2rem,3.5vw,2.2rem)] text-primary-300 mb-8 mt-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              IN DULUTH, GEORGIA
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 font-black text-lg tracking-tight uppercase transition-all duration-200 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Schedule Estimate
              </motion.a>
              <motion.a
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white/60 hover:border-white text-white hover:bg-white/10 px-10 py-4 font-black text-lg tracking-tight uppercase transition-all duration-200 group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span>Contact Us</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>
            <motion.div
              className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { value: "5.0★", label: "Google Rating" },
                { value: "34+", label: "Verified Reviews" },
                { value: "LIFETIME", label: "Warranty" },
                { value: "FREE", label: "Estimates" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="display-heading text-3xl text-white">{stat.value}</span>
                  <span className="stat-label text-white/50 mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Interstitial */}
      <section className="bg-primary-600 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.05) 40px,
              rgba(255,255,255,0.05) 80px
            )`
          }}
        />
        <div className="container mx-auto px-4 relative">
          <motion.p
            className="stat-label text-primary-200 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Free. Fast. No Obligation.
          </motion.p>
          <motion.h2
            className="display-heading text-[clamp(2.5rem,7vw,5.5rem)] text-white mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            READY TO GET
            <br />
            <span className="text-primary-200">YOUR CAR FIXED?</span>
          </motion.h2>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="tel:+17704950050"
              className="inline-flex items-center justify-center gap-3 bg-white text-primary-700 px-10 py-4 font-black text-lg uppercase tracking-tight hover:bg-primary-50 transition-colors duration-200"
            >
              CALL (770) 495-0050
            </a>
            <a
              href="#schedule"
              onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center gap-3 border-2 border-white/60 text-white px-10 py-4 font-black text-lg uppercase tracking-tight hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              Book Online ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="schedule" className="py-16 relative overflow-hidden bg-gray-50">
        <MouseFollowGradient variant="light" opacity={0.6} />
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-3 text-sm font-semibold tracking-wider text-primary-700 uppercase bg-primary-50/80 backdrop-blur-sm rounded-full shadow-sm border border-primary-100/50"
            >
              BOOK YOUR SERVICE
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              Schedule Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                  Auto Estimate
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary-100/80 -rotate-1"></span>
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              Book your appointment with our expert technicians. We&apos;ll get your vehicle back to its best condition.
            </motion.p>
          </div>

          {/* Calendly Widget */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div 
              id="calendly-inline-widget" 
              className="w-full rounded-2xl overflow-hidden"
              style={{
                width: '100%',
                height: '700px',
                border: 'none'
              }}
            ></div>
          </div>
        </div>

        {/* Calendly Widget Script */}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
          onLoad={() => {
            if (typeof window !== 'undefined' && window.Calendly) {
              window.Calendly.initInlineWidget({
                url: 'https://calendly.com/taylorscollision/collision_estimate',
                parentElement: document.getElementById('calendly-inline-widget'),
                prefill: {},
                utm: {},
                branding: false
              });
            }
          }}
        />
      </section>

      {/* Trust Band Section */}
      <section className="bg-primary-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.03) 40px,
              rgba(255,255,255,0.03) 80px
            )`
          }}
        />
        <div className="container mx-auto px-4 relative">
          <motion.p
            className="stat-label text-primary-400 text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Guarantee
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-5xl mx-auto">
            {[
              { value: "LIFETIME", label: "WARRANTY" },
              { value: "FREE", label: "ESTIMATES" },
              { value: "INSURANCE", label: "APPROVED" },
              { value: "24/7", label: "TOWING" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="display-heading text-[clamp(1.8rem,4vw,3rem)] text-white">{badge.value}</p>
                <p className="stat-label text-primary-400 mt-2">{badge.label}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="flex justify-center items-center gap-10 mt-16 pt-12 border-t border-primary-700/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="opacity-75 hover:opacity-100 transition-opacity duration-300">
              <Image src="/images/PPG.png" alt="PPG Certified" width={200} height={200} className="object-contain h-28 w-auto" />
            </div>
            <div className="w-px h-20 bg-primary-700/50" />
            <div className="opacity-75 hover:opacity-100 transition-opacity duration-300">
              <Image src="/images/BBB.png" alt="Better Business Bureau" width={200} height={200} className="object-contain h-28 w-auto" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-2 relative overflow-hidden bg-white">
        <MouseFollowGradient variant="light" opacity={0.7} />
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-50/30 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative pt-20">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="stat-label text-primary-600 mb-4 block">Our Expertise</span>
            <h2 className="display-heading text-[clamp(2.5rem,6vw,5rem)] text-gray-900 mb-4">
              WHAT WE FIX.
            </h2>
          </motion.div>
        </div>

        <div className="py-8">
          <div className="container mx-auto px-4 mb-6">
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              We specialize in comprehensive auto body repair services, from collision repair and dent removal to expert paint matching and structural repairs.
            </motion.p>
          </div>

          <ServiceGrid />
          
          <div className="text-center mt-6">
            <motion.a 
              href="/services" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <span className="relative">Explore Our Services</span>
              <ArrowRightIcon className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Reviews Preview Section */}
      <section className="py-24 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 relative overflow-hidden">
        <MouseFollowGradient variant="dark" opacity={0.7} size={800} />
        <div className="container mx-auto px-4 relative">
          <div className="mb-16">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Image 
                  src="/google.svg" 
                  alt="Google" 
                  width={20} 
                  height={20}
                  className="w-5 h-5"
                />
                <span className="stat-label text-white" style={{ fontSize: '0.7rem' }}>Verified Google Reviews</span>
                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <motion.h2
              className="display-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              WHAT OUR
              <br />
              <span className="text-primary-300">CUSTOMERS SAY.</span>
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-blue-50 leading-relaxed mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              We&apos;re committed to excellence
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
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
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/8 backdrop-blur-sm rounded-xl p-6 border-l-4 border-l-primary-400 border border-white/10 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex text-yellow-400 mb-5 gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 leading-relaxed">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-medium">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{review.author}</p>
                    <p className="text-sm text-blue-200">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.a
              href="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
            >
              View All Reviews
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

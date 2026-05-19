'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { formatPhoneNumber, validateEmail, validatePhone } from '@/utils/formatters'
import {
  StarIcon,
  CurrencyDollarIcon,
  HeartIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const BRAND_BLUE = '#0ea5e9'

const NOISE_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")"

interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  references: Reference[];
}

export default function CareersPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    position: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    references: [{
      name: '',
      relationship: '',
      phone: '',
      email: ''
    }]
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
    references: [{ email: '', phone: '' }]
  })
  const [resume, setResume] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }))
      setFormErrors(prev => ({
        ...prev,
        phone: validatePhone(formattedPhone) ? '' : 'Please enter a valid 10-digit phone number'
      }))
    } else if (name === 'email') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      setFormErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Please enter a valid email address'
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setSubmitStatus({
          type: 'error',
          message: 'Resume file size must be less than 10MB'
        })
        return
      }
      setResume(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    // Supabase (resume upload + row) is best-effort; the email to the
    // shop is the source of truth so an application is never dropped.
    let resumeUrl = ''
    try {
      if (supabase) {
        if (resume) {
          const fileExt = resume.name.split('.').pop()
          const fileName = `${Date.now()}-${formData.firstName}-${formData.lastName}.${fileExt}`
          const { data: uploadData, error: uploadError } = await supabase
            .storage.from('resumes').upload(fileName, resume)
          if (!uploadError && uploadData) resumeUrl = uploadData.path
        }
        await supabase.from('job_applications').insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || '',
          city: formData.city || '',
          state: formData.state || '',
          zip: formData.zip || '',
          position: formData.position,
          start_date: new Date().toISOString().split('T')[0],
          experience: formData.experience,
          resume_url: resumeUrl || null
        })
      }
    } catch (dbErr) {
      console.error('Supabase (non-fatal):', dbErr)
    }

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'application', data: { ...formData, resumeUrl } }),
      })
      if (!res.ok) throw new Error('notify failed')
      router.push('/careers/success')
    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitStatus({
        type: 'error',
        message: 'There was an error submitting your application. Please call us at (770) 495-0050.'
      })
      setIsSubmitting(false)
    }
  }

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', relationship: '', phone: '', email: '' }]
    }))
  }

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }))
  }

  const handleReferenceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => {
        if (i === index) {
          if (field === 'phone') {
            return { ...ref, [field]: formatPhoneNumber(value) }
          }
          return { ...ref, [field]: value }
        }
        return ref
      })
    }))

    if (field === 'email' || field === 'phone') {
      setFormErrors(prev => ({
        ...prev,
        references: prev.references.map((ref, i) => {
          if (i === index) {
            if (field === 'email') {
              return { ...ref, email: validateEmail(value) ? '' : 'Please enter a valid email address' }
            }
            if (field === 'phone') {
              return { ...ref, phone: validatePhone(value) ? '' : 'Please enter a valid 10-digit phone number' }
            }
          }
          return ref
        })
      }))
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden text-white pt-28 sm:pt-32 pb-16 sm:pb-20"
        style={{ background: '#06121f' }}
      >
        {/* SVG noise grain */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ opacity: 0.28, backgroundImage: NOISE_BG }}
        />
        {/* Blue halos */}
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
        {/* Top accent + bottom diag-stripe */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: BRAND_BLUE }} />
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
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center justify-center gap-2 mb-5"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: BRAND_BLUE, boxShadow: `0 0 12px ${BRAND_BLUE}` }} />
              <span className="stat-label" style={{ color: BRAND_BLUE }}>Careers · Now Hiring</span>
            </motion.div>

            <motion.h1
              className="font-display text-white leading-[0.88]"
              style={{ fontSize: 'clamp(2.75rem,9vw,6.5rem)', letterSpacing: '0.005em' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              Join The
              <br />
              <span style={{ color: BRAND_BLUE, textShadow: '0 0 32px rgba(14,165,233,0.35)' }}>Team.</span>
            </motion.h1>

            <motion.p
              className="text-white/80 leading-relaxed max-w-2xl mx-auto mt-6 mb-10 text-base sm:text-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              Build your career at Taylor&apos;s Collision — Duluth&apos;s trusted auto body shop. We&apos;re
              hiring skilled technicians who take pride in their craft.
            </motion.p>

            <motion.div
              className="flex flex-col xs:flex-row sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
            >
              <a
                href="#apply-form"
                onClick={(e) => { e.preventDefault(); document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-cta btn-cta-primary"
              >
                Apply Now
              </a>
              <a href="tel:+17704950050" className="btn-cta btn-cta-ghost">
                Call (770) 495-0050
              </a>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-6 mt-10 sm:mt-14 max-w-md mx-auto"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
            >
              <div
                className="rounded-2xl px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <p className="font-display text-2xl sm:text-3xl leading-none" style={{ color: BRAND_BLUE }}>15+</p>
                <p className="stat-label mt-2 text-white/70">Years in Business</p>
              </div>
              <div
                className="rounded-2xl px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <p className="font-display text-2xl sm:text-3xl leading-none" style={{ color: BRAND_BLUE }}>Family</p>
                <p className="stat-label mt-2 text-white/70">Owned · Local</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ WHY JOIN US ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/60 via-white to-primary-50/60 py-16 sm:py-24">
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="stat-label text-primary-600">Why Join Us</span>
            </div>
            <h2
              className="font-display text-primary-900 leading-[0.9]"
              style={{ fontSize: 'clamp(2.25rem,6vw,4rem)', letterSpacing: '0.005em' }}
            >
              The Shop. The Crew.
              <br />
              <span className="text-primary-500">The Future.</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { Icon: StarIcon, title: 'Career Growth', body: 'Ongoing training and certification opportunities. Advance from technician to lead to shop manager.' },
              { Icon: CurrencyDollarIcon, title: 'Competitive Pay', body: 'Top-of-market wages, performance bonuses, and full health benefits for full-time staff.' },
              { Icon: HeartIcon, title: 'Great Culture', body: 'Family-owned business where your work is recognized. Tight-knit team environment.' },
            ].map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i }}
                className="group rounded-2xl bg-white ring-1 ring-primary-200/60 shadow-[0_18px_40px_-22px_rgba(2,132,199,0.3)] hover:shadow-[0_28px_50px_-22px_rgba(2,132,199,0.45)] hover:ring-primary-400/60 transition-all duration-300 p-6 sm:p-7"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0.04) 100%)',
                    border: '1px solid rgba(14,165,233,0.28)',
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: BRAND_BLUE }} />
                </div>
                <h3 className="font-display tracking-[0.06em] text-primary-900 text-xl uppercase mb-2">{title}</h3>
                <p className="text-primary-900/70 text-[14.5px] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APPLICATION FORM ============ */}
      <section id="apply-form" className="relative bg-gradient-to-b from-primary-50/30 via-white to-primary-50/30 py-14 sm:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="stat-label text-primary-600">Application</span>
              </div>
              <h2
                className="font-display text-primary-900 leading-[0.9]"
                style={{ fontSize: 'clamp(2.25rem,6vw,4rem)', letterSpacing: '0.005em' }}
              >
                Apply
                <br />
                <span className="text-primary-500">Today.</span>
              </h2>
            </div>

            <motion.div
              className="bg-white rounded-2xl shadow-[0_30px_60px_-30px_rgba(2,132,199,0.3)] ring-1 ring-primary-200/60 p-4 sm:p-8 lg:p-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <fieldset className="bg-primary-50/40 ring-1 ring-primary-100 p-4 sm:p-6 rounded-xl">
                  <legend className="font-display tracking-[0.06em] uppercase text-primary-900 text-base sm:text-lg px-2">
                    Personal Information
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-3">
                    <div>
                      <label htmlFor="firstName" className="stat-label text-primary-700 block mb-1.5">First Name</label>
                      <input
                        type="text" id="firstName" name="firstName" required
                        value={formData.firstName} onChange={handleInputChange}
                        className="w-full h-12 px-4 bg-white border border-primary-200 rounded-lg text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="stat-label text-primary-700 block mb-1.5">Last Name</label>
                      <input
                        type="text" id="lastName" name="lastName" required
                        value={formData.lastName} onChange={handleInputChange}
                        className="w-full h-12 px-4 bg-white border border-primary-200 rounded-lg text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="stat-label text-primary-700 block mb-1.5">Email Address</label>
                      <input
                        type="email" id="email" name="email" required
                        value={formData.email} onChange={handleInputChange}
                        className={`w-full h-12 px-4 bg-white border rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${formErrors.email ? 'border-red-500' : 'border-primary-200'}`}
                      />
                      {formErrors.email && <p className="mt-1.5 text-xs text-red-600">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="stat-label text-primary-700 block mb-1.5">Phone Number</label>
                      <input
                        type="tel" id="phone" name="phone" required placeholder="(555) 555-5555"
                        value={formData.phone} onChange={handleInputChange}
                        className={`w-full h-12 px-4 bg-white border rounded-lg text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${formErrors.phone ? 'border-red-500' : 'border-primary-200'}`}
                      />
                      {formErrors.phone && <p className="mt-1.5 text-xs text-red-600">{formErrors.phone}</p>}
                    </div>
                  </div>
                </fieldset>

                {/* Professional Information */}
                <fieldset className="bg-primary-50/40 ring-1 ring-primary-100 p-4 sm:p-6 rounded-xl">
                  <legend className="font-display tracking-[0.06em] uppercase text-primary-900 text-base sm:text-lg px-2">
                    Professional Information
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-3">
                    <div>
                      <label htmlFor="experience" className="stat-label text-primary-700 block mb-1.5">Years of Experience</label>
                      <input
                        type="number" id="experience" name="experience" required min="0" max="50"
                        value={formData.experience} onChange={handleInputChange}
                        className="w-full h-12 px-4 bg-white border border-primary-200 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="position" className="stat-label text-primary-700 block mb-1.5">Position</label>
                      <select
                        id="position" name="position" required
                        value={formData.position} onChange={handleInputChange}
                        className="w-full h-12 px-4 bg-white border border-primary-200 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                      >
                        <option value="">Select a position</option>
                        <option value="Auto Body Technician">Auto Body Technician</option>
                        <option value="Painter">Painter</option>
                        <option value="Estimator">Estimator</option>
                        <option value="Customer Service">Customer Service</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="resume" className="stat-label text-primary-700 block mb-1.5">Resume (PDF, DOC, DOCX — Max 10MB)</label>
                      <input
                        type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange}
                        className="w-full px-4 py-3 bg-white border border-primary-200 rounded-lg text-primary-900 text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* References */}
                <fieldset className="bg-primary-50/40 ring-1 ring-primary-100 p-4 sm:p-6 rounded-xl">
                  <legend className="font-display tracking-[0.06em] uppercase text-primary-900 text-base sm:text-lg px-2">
                    References
                  </legend>
                  <div className="flex items-center justify-end mt-2 mb-4">
                    <button
                      type="button" onClick={addReference}
                      className="text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-900 bg-white border border-primary-300 hover:border-primary-500 px-3 py-1.5 rounded-md transition-colors"
                    >
                      + Add Reference
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.references.map((reference, index) => (
                      <div key={index} className="bg-white rounded-lg ring-1 ring-primary-100 p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-display tracking-[0.06em] uppercase text-primary-900 text-sm sm:text-base">Reference #{index + 1}</h4>
                          {index > 0 && (
                            <button type="button" onClick={() => removeReference(index)} className="text-xs text-red-600 hover:text-red-700 font-semibold">
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="stat-label text-primary-700 block mb-1.5">Full Name</label>
                            <input
                              type="text" required value={reference.name}
                              onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                              className="w-full h-11 px-4 bg-white border border-primary-200 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="stat-label text-primary-700 block mb-1.5">Relationship</label>
                            <input
                              type="text" required value={reference.relationship}
                              onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                              className="w-full h-11 px-4 bg-white border border-primary-200 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="stat-label text-primary-700 block mb-1.5">Email Address</label>
                            <input
                              type="email" required value={reference.email}
                              onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                              className={`w-full h-11 px-4 bg-white border rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${formErrors.references[index]?.email ? 'border-red-500' : 'border-primary-200'}`}
                            />
                            {formErrors.references[index]?.email && <p className="mt-1.5 text-xs text-red-600">{formErrors.references[index].email}</p>}
                          </div>
                          <div>
                            <label className="stat-label text-primary-700 block mb-1.5">Phone Number</label>
                            <input
                              type="tel" required placeholder="(555) 555-5555" value={reference.phone}
                              onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                              className={`w-full h-11 px-4 bg-white border rounded-lg text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${formErrors.references[index]?.phone ? 'border-red-500' : 'border-primary-200'}`}
                            />
                            {formErrors.references[index]?.phone && <p className="mt-1.5 text-xs text-red-600">{formErrors.references[index].phone}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* Submit */}
                <button
                  type="submit" disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center gap-2 h-14 rounded-md font-display tracking-[0.14em] uppercase text-sm sm:text-base text-white transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-[0_18px_36px_-12px_rgba(2,132,199,0.55)] hover:shadow-[0_24px_44px_-12px_rgba(2,132,199,0.7)]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>

                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-start gap-2.5 ${
                      submitStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-red-50 text-red-900 border border-red-200'
                    }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-sm leading-relaxed">{submitStatus.message}</span>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ CTA INTERSTITIAL ============ */}
      <section className="relative overflow-hidden py-14 sm:py-20 text-center bg-gradient-to-br from-primary-500 via-primary-400 to-primary-500">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-white/15 blur-3xl pointer-events-none" />

        <div className="container relative">
          <p className="stat-label text-primary-50 mb-3">Got Questions?</p>
          <h2
            className="font-display text-white leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(2.25rem,7vw,4.5rem)', letterSpacing: '0.005em' }}
          >
            Give Us
            <br />
            <span className="text-primary-100">A Call.</span>
          </h2>
          <p className="text-primary-50/90 text-base sm:text-lg max-w-lg mx-auto mb-8">
            We&apos;d love to talk to you about joining the team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+17704950050" className="btn-cta bg-white text-primary-700 hover:bg-primary-50">
              Call (770) 495-0050
            </a>
            <a
              href="#apply-form"
              onClick={(e) => { e.preventDefault(); document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-cta btn-cta-ghost"
            >
              Apply Online ↓
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

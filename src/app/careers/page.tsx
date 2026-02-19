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
} from '@heroicons/react/24/outline'

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

    try {
      // Upload resume to Supabase Storage if present
      let resumeUrl = ''
      if (resume) {
        const fileExt = resume.name.split('.').pop()
        const fileName = `${Date.now()}-${formData.firstName}-${formData.lastName}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('resumes')
          .upload(fileName, resume)

        if (uploadError) {
          console.error('Resume upload error:', uploadError)
          throw uploadError
        }
        
        resumeUrl = uploadData.path
      }

      // Save application data to Supabase
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || '',  // Add default values for required fields
          city: formData.city || '',
          state: formData.state || '',
          zip: formData.zip || '',
          position: formData.position,
          start_date: new Date().toISOString().split('T')[0],  // Current date as default
          experience: formData.experience,
          resume_url: resumeUrl || null
        })

      if (insertError) {
        console.error('Application insert error:', insertError)
        throw insertError
      }

      // Send email notification (fire and forget)
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'application', data: { ...formData, resumeUrl } }),
      }).catch(() => {})

      // Redirect to success page
      router.push('/careers/success')

    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitStatus({
        type: 'error',
        message: 'There was an error submitting your application. Please try again.'
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 pt-32 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large blurred circles */}
          <div className="absolute w-[500px] h-[500px] -top-48 -left-48 bg-primary-400/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute w-[400px] h-[400px] -bottom-48 -right-48 bg-primary-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="display-heading text-white" style={{ fontSize: 'clamp(2.8rem,8vw,6rem)' }}>
                JOIN THE<br />
                <span className="text-primary-300">TEAM.</span>
              </h1>
            </motion.div>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-lg md:text-xl text-blue-50 leading-relaxed max-w-2xl mx-auto mb-8">
                Build your career at Taylor&apos;s Collision — Duluth&apos;s trusted auto body shop. We&apos;re hiring skilled technicians who take pride in their craft.
              </p>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              className="flex justify-center gap-12 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center">
                <div className="display-heading text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}>15+</div>
                <div className="stat-label text-primary-300 mt-1">Years in Business</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="display-heading text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Family</div>
                <div className="stat-label text-primary-300 mt-1">Owned</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="display-heading text-primary-800" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
              WHY JOIN<br />OUR TEAM?
            </h2>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Career Growth */}
            <div className="border-l-4 border-l-primary-500 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <StarIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Career Growth</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ongoing training and certification opportunities. Advance from technician to lead to shop manager.
              </p>
            </div>

            {/* Competitive Pay */}
            <div className="border-l-4 border-l-primary-500 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <CurrencyDollarIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Competitive Pay</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Top-of-market wages, performance bonuses, and full health benefits for full-time staff.
              </p>
            </div>

            {/* Great Culture */}
            <div className="border-l-4 border-l-primary-500 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <HeartIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Great Culture</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Family-owned business where your work is recognized. Tight-knit team environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="display-heading text-primary-800" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                APPLY<br />NOW.
              </h2>
            </div>
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(555) 555-5555"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        required
                        min="0"
                        max="50"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <select
                        id="position"
                        name="position"
                        required
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a position</option>
                        <option value="Auto Body Technician">Auto Body Technician</option>
                        <option value="Painter">Painter</option>
                        <option value="Estimator">Estimator</option>
                        <option value="Customer Service">Customer Service</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                        Resume (PDF, DOC, DOCX - Max 10MB)
                      </label>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* References Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">References</h3>
                    <button
                      type="button"
                      onClick={addReference}
                      className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-white rounded-lg border border-primary-600 hover:border-primary-700 transition-colors"
                    >
                      Add Reference
                    </button>
                  </div>
                  
                  {formData.references.map((reference, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-700">Reference #{index + 1}</h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={reference.name}
                            onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relationship
                          </label>
                          <input
                            type="text"
                            required
                            value={reference.relationship}
                            onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={reference.email}
                            onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                              formErrors.references[index]?.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.references[index]?.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.references[index].email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={reference.phone}
                            onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                              formErrors.references[index]?.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="(555) 555-5555"
                          />
                          {formErrors.references[index]?.phone && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.references[index].phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-4 text-white font-bold uppercase tracking-wider text-lg transition-all duration-200 rounded-none
                      ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
                      }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : 'SUBMIT APPLICATION →'}
                  </button>
                </div>

                {/* Status Message */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {submitStatus.type === 'success' ? (
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                      )}
                      {submitStatus.message}
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 40px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="display-heading text-white mb-4" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}>
                QUESTIONS?<br />GIVE US A CALL.
              </h2>
              <p className="text-lg text-primary-200 mb-8 max-w-lg mx-auto">
                We&apos;d love to talk to you about joining the team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="tel:+17704950050"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-800 font-bold uppercase tracking-wider text-sm transition-all duration-200 hover:bg-primary-50"
                >
                  (770) 495-0050
                </a>
                <a
                  href="#apply-form"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider text-sm transition-all duration-200 hover:bg-white hover:text-primary-800"
                >
                  Apply Online
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

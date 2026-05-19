'use client'

import { useState, useMemo, useId } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CalendarDaysIcon, CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import { supabase } from '@/lib/supabase'

/* Mirrors Taylor's real Zoho availability: Mon–Sat, 30-min Free Collision
   Estimate slots. Sundays closed. Request-based — the shop confirms. */
const SLOTS = [
  { period: 'Morning', times: ['9:00 AM', '9:45 AM', '10:30 AM', '11:15 AM'] },
  { period: 'Afternoon', times: ['12:00 PM', '12:45 PM', '1:30 PM', '2:15 PM', '3:00 PM', '3:45 PM', '4:00 PM'] },
]
const PHONE = '(770) 495-0050'
const TEL = '+17704950050'
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

type Step = 'date' | 'time' | 'details' | 'done'

export default function BookingCalendar() {
  const reduce = useReducedMotion()
  const today = useMemo(() => startOfDay(new Date()), [])
  const formId = useId()

  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('date')
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only let people browse the current and next two months.
  const maxMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 2, 1), [today])
  const canPrev = viewMonth > new Date(today.getFullYear(), today.getMonth(), 1)
  const canNext = viewMonth < maxMonth

  const grid = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < first.getDay(); i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d))
    return cells
  }, [viewMonth])

  const isClosed = (d: Date) => d.getDay() === 0 // Sundays
  const isPast = (d: Date) => d < today

  const niceDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const reset = () => {
    setDate(null); setTime(null); setForm({ name: '', email: '', phone: '', vehicle: '', notes: '' })
    setError(null); setStep('date')
  }

  async function submit() {
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) {
      setError('Please add your name and a 10-digit phone number.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please add a valid email — that’s where we send your confirmation.')
      return
    }
    setSubmitting(true)
    setError(null)
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      vehicle: form.vehicle.trim(),
      notes: form.notes.trim(),
      preferred_date: date ? niceDate(date) : '',
      preferred_date_iso: date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        : '',
      preferred_time: time || '',
    }
    // Supabase is best-effort; the email is the source of truth so a
    // missing table/config never silently drops a booking lead.
    try {
      if (supabase) await supabase.from('appointment_requests').insert([payload])
    } catch {/* non-fatal */}
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'appointment_request', data: payload }),
      })
      if (!res.ok) throw new Error('notify failed')
      setStep('done')
    } catch {
      setError(`Couldn't send your request. Please call us at ${PHONE}.`)
    } finally {
      setSubmitting(false)
    }
  }

  const ease = [0.16, 1, 0.3, 1] as const
  const variants = {
    enter: reduce ? { opacity: 0 } : { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, x: -24 },
  }

  const stepIndex = { date: 0, time: 1, details: 2, done: 3 }[step]

  return (
    <div className="bg-white rounded-2xl shadow-[0_30px_60px_-30px_rgba(2,132,199,0.3)] ring-1 ring-primary-200/60 overflow-hidden">
      {/* Header / progress */}
      <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-primary-100/80 bg-gradient-to-br from-primary-50/70 to-white">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.18), rgba(14,165,233,0.04))', border: '1px solid rgba(14,165,233,0.28)' }}
          >
            <CalendarDaysIcon className="w-6 h-6 text-primary-500" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display tracking-[0.04em] uppercase text-primary-950 text-xl sm:text-2xl leading-none">
              Book Your Free Estimate
            </h3>
            <p className="text-primary-700/70 text-[0.8rem] sm:text-sm mt-1">
              30 minutes · In-person · Duluth, GA
            </p>
          </div>
        </div>
        {step !== 'done' && (
          <div className="flex gap-1.5 mt-5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i <= stepIndex ? 'bg-primary-500' : 'bg-primary-100'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-7 min-h-[420px]">
        <AnimatePresence mode="wait" initial={false}>
          {/* ---------- STEP 1: DATE ---------- */}
          {step === 'date' && (
            <motion.div key="date" variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease }}>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                  disabled={!canPrev}
                  aria-label="Previous month"
                  className="w-9 h-9 grid place-items-center rounded-lg text-primary-700 hover:bg-primary-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <span className="font-display tracking-[0.05em] uppercase text-primary-950 text-lg">
                  {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                  disabled={!canNext}
                  aria-label="Next month"
                  className="w-9 h-9 grid place-items-center rounded-lg text-primary-700 hover:bg-primary-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1.5">
                {WEEKDAYS.map((d, i) => (
                  <span key={i} className="text-center text-[0.62rem] font-semibold tracking-[0.12em] text-primary-400 uppercase py-1">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {grid.map((d, i) => {
                  if (!d) return <span key={i} />
                  const disabled = isPast(d) || isClosed(d)
                  const selected = date && d.getTime() === date.getTime()
                  const isToday = d.getTime() === today.getTime()
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      aria-label={`${niceDate(d)}${disabled ? ' (unavailable)' : ''}`}
                      aria-pressed={!!selected}
                      onClick={() => { setDate(d); setTime(null); setStep('time') }}
                      className={[
                        'aspect-square rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                        selected ? 'bg-primary-500 text-white shadow-[0_8px_20px_-8px_rgba(14,165,233,0.7)]'
                          : disabled ? 'text-primary-200 cursor-not-allowed line-through decoration-1'
                          : 'text-primary-900 hover:bg-primary-50',
                        !selected && isToday ? 'ring-1 ring-primary-300' : '',
                      ].join(' ')}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>
              <p className="text-center text-primary-500/70 text-xs mt-5">
                Closed Sundays · Prefer to talk?{' '}
                <a href={`tel:${TEL}`} className="font-semibold text-primary-600 underline underline-offset-2">{PHONE}</a>
              </p>
            </motion.div>
          )}

          {/* ---------- STEP 2: TIME ---------- */}
          {step === 'time' && date && (
            <motion.div key="time" variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease }}>
              <button
                type="button"
                onClick={() => setStep('date')}
                className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold mb-4 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                <ArrowLeftIcon className="w-4 h-4" /> {niceDate(date)}
              </button>
              <p className="text-primary-900/70 text-sm mb-4">Pick a time that works for you:</p>
              <div className="space-y-5" role="radiogroup" aria-label="Available times">
                {SLOTS.map((group) => (
                  <div key={group.period}>
                    <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-primary-400 uppercase mb-2">
                      {group.period}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {group.times.map((t) => {
                        const selected = time === t
                        return (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => { setTime(t); setStep('details') }}
                            className={[
                              'py-2.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                              selected ? 'bg-primary-500 text-white shadow-[0_8px_20px_-8px_rgba(14,165,233,0.7)]'
                                : 'bg-primary-50 text-primary-800 hover:bg-primary-100 ring-1 ring-primary-100',
                            ].join(' ')}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------- STEP 3: DETAILS ---------- */}
          {step === 'details' && date && time && (
            <motion.div key="details" variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease }}>
              <button
                type="button"
                onClick={() => setStep('time')}
                className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold mb-3 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Change date / time
              </button>
              <div className="flex items-center gap-2 mb-5 px-3.5 py-2.5 rounded-xl bg-primary-50 ring-1 ring-primary-100">
                <CalendarDaysIcon className="w-4 h-4 text-primary-500 shrink-0" />
                <span className="text-sm font-semibold text-primary-900">{niceDate(date)} · {time}</span>
              </div>
              <form
                className="space-y-3.5"
                onSubmit={(e) => { e.preventDefault(); submit() }}
              >
                <div>
                  <label htmlFor={`${formId}-name`} className="block text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-primary-500 mb-1.5">
                    Your name <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id={`${formId}-name`} required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-primary-200 focus:ring-2 focus:ring-primary-500 focus:outline-none text-primary-900 placeholder:text-primary-300 transition-shadow"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-email`} className="block text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-primary-500 mb-1.5">
                    Email <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id={`${formId}-email`} required type="email" inputMode="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-primary-200 focus:ring-2 focus:ring-primary-500 focus:outline-none text-primary-900 placeholder:text-primary-300 transition-shadow"
                    placeholder="jane@email.com"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-phone`} className="block text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-primary-500 mb-1.5">
                    Phone <span className="text-primary-400">*</span>
                  </label>
                  <input
                    id={`${formId}-phone`} required inputMode="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-primary-200 focus:ring-2 focus:ring-primary-500 focus:outline-none text-primary-900 placeholder:text-primary-300 transition-shadow"
                    placeholder="(770) 495-0050"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-vehicle`} className="block text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-primary-500 mb-1.5">
                    Vehicle
                  </label>
                  <input
                    id={`${formId}-vehicle`} value={form.vehicle}
                    onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-primary-200 focus:ring-2 focus:ring-primary-500 focus:outline-none text-primary-900 placeholder:text-primary-300 transition-shadow"
                    placeholder="2020 Honda Accord"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-notes`} className="block text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-primary-500 mb-1.5">
                    What happened?
                  </label>
                  <textarea
                    id={`${formId}-notes`} rows={2} value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-primary-200 focus:ring-2 focus:ring-primary-500 focus:outline-none text-primary-900 placeholder:text-primary-300 resize-none transition-shadow"
                    placeholder="Rear bumper damage from a parking-lot accident…"
                  />
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-600 bg-red-50 ring-1 ring-red-200 rounded-lg px-3.5 py-2.5">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-cta btn-cta-primary w-full disabled:opacity-70"
                >
                  {submitting ? 'Sending…' : 'Request This Time'}
                  {!submitting && <ArrowRightIcon className="w-4 h-4 ml-2" />}
                </button>
                <p className="text-center text-primary-500/70 text-xs">
                  Once the shop approves your time, a confirmation lands in your inbox.
                </p>
              </form>
            </motion.div>
          )}

          {/* ---------- DONE ---------- */}
          {step === 'done' && (
            <motion.div key="done" variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease }} className="text-center py-6">
              <motion.span
                initial={reduce ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 ring-1 ring-primary-200 mb-5"
              >
                <CheckCircleIcon className="w-9 h-9 text-primary-500" />
              </motion.span>
              <h3 className="font-display tracking-[0.04em] uppercase text-primary-950 text-2xl mb-2">
                Request Received
              </h3>
              <p className="text-primary-900/70 text-sm sm:text-base max-w-sm mx-auto mb-1">
                Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''} — we&apos;ve got your request for
              </p>
              <p className="font-semibold text-primary-900 mb-5">
                {date && niceDate(date)} · {time}
              </p>
              <p className="text-primary-700/70 text-sm max-w-sm mx-auto mb-6">
                We&apos;ll review it and email a confirmation to{' '}
                <span className="font-semibold text-primary-900">{form.email}</span>.
                Need it sooner? Give us a call.
              </p>
              <a href={`tel:${TEL}`} className="btn-cta btn-cta-primary w-full sm:w-auto">
                Call {PHONE}
              </a>
              <button
                type="button"
                onClick={reset}
                className="block mx-auto mt-4 text-primary-600 text-sm font-semibold hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                Book another time
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingCalendar from '@/components/BookingCalendar';

export default function ScheduleNow() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Schedule Your Service
            </h1>
            <p className="text-lg text-blue-50">
              Book your appointment with our expert technicians. We&apos;ll get your vehicle back to its best condition.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 py-16">
        <BookingCalendar />
      </div>

      <Footer />
    </main>
  );
}

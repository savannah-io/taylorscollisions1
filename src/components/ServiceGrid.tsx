'use client'

import { motion } from 'framer-motion'
import {
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  WrenchIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'

const services = [
  {
    title: "Collision Repair",
    description: "Expert repair for all types of collision damage. We restore your vehicle to pre-accident condition using OEM parts and PPG paint systems — backed by our lifetime warranty.",
    Icon: WrenchScrewdriverIcon,
    large: true,
  },
  {
    title: "Paint Services",
    description: "Computerized color matching. Perfect finish every time.",
    Icon: PaintBrushIcon,
  },
  {
    title: "Dent Removal",
    description: "Paintless dent repair that preserves your original paint.",
    Icon: WrenchIcon,
  },
  {
    title: "Frame & Alignment",
    description: "Precision frame straightening and wheel alignment.",
    Icon: ScaleIcon,
  },
  {
    title: "Insurance Claims",
    description: "We handle the paperwork with all major insurers.",
    Icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Auto Detailing",
    description: "Interior and exterior detailing services.",
    Icon: SparklesIcon,
  },
]

export default function ServiceGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {services.map((service, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
          className={`group relative bg-white border-2 border-gray-100 hover:border-primary-500
            rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1
            ${service.large
              ? 'md:col-span-2 md:row-span-2 p-7 md:p-10 flex flex-col justify-between min-h-[320px]'
              : 'p-7'
            }`}
        >
          <div>
            <div className={`text-primary-600 mb-5 ${service.large ? 'w-14 h-14' : 'w-9 h-9'}`}>
              <service.Icon className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className={`font-black tracking-tight text-gray-900 uppercase mb-3
              ${service.large ? 'text-3xl' : 'text-base'}`}
            >
              {service.title}
            </h3>
            <p className={`text-gray-500 leading-relaxed
              ${service.large ? 'text-base max-w-sm' : 'text-sm'}`}
            >
              {service.description}
            </p>
          </div>
          {service.large && (
            <div className="mt-8">
              <span className="inline-flex items-center gap-2 text-primary-600 font-black text-sm tracking-wider uppercase
                border-b-2 border-primary-600 pb-0.5 group-hover:gap-3 transition-all duration-200">
                Free Estimate →
              </span>
            </div>
          )}
          {/* Blue accent line on hover */}
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100
            transition-transform duration-300 rounded-b-2xl origin-left" />
        </motion.div>
      ))}
    </div>
  )
}

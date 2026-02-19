'use client'

import { motion } from 'framer-motion'

interface TextGenerateEffectProps {
  words: string
  className?: string
  duration?: number
}

export function TextGenerateEffect({ words, className = '', duration = 0.5 }: TextGenerateEffectProps) {
  const wordList = words.split(' ')

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
    >
      {wordList.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em] last:mr-0"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: duration,
                delay: i * duration * 0.4,
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

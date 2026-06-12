import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'

const Hero = () => (
  <section
    id="hero"
    className="relative min-h-screen flex items-center justify-center px-6 pt-20"
  >
    {/* Subtle gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-accent/5 via-ink to-cyan-accent/5" />

    <div className="relative z-10 max-w-4xl text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold leading-tight"
      >
        We Build{' '}
        <span className="bg-gradient-to-r from-blue-accent via-indigo-accent to-cyan-accent bg-clip-text text-transparent">
          Future‑Ready
        </span>{' '}
        ICT Solutions
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto"
      >
        Software engineering, AI, cloud, cybersecurity – we deliver
        end‑to‑end technology services that transform your business.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-10 flex flex-wrap gap-4 justify-center"
      >
        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-cyan-accent text-ink font-semibold px-8 py-3 rounded-full hover:bg-cyan-400 transition"
        >
          Start a Project <HiArrowRight />
        </a>
        <a
          href="#services"
          className="inline-flex items-center gap-2 border border-muted text-text-primary px-8 py-3 rounded-full hover:border-cyan-accent transition"
        >
          Explore Services
        </a>
      </motion.div>
    </div>
  </section>
)

export default Hero
import Reveal from './Reveal'
import { HiMail, HiLocationMarker } from 'react-icons/hi'

const CTA = () => (
  <section id="contact" className="py-24 bg-surface">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold">
          Let’s Build Something <span className="text-cyan-accent">Great</span>
        </h2>
        <p className="mt-4 text-muted max-w-xl mx-auto">
          Whether you need a full digital transformation or a specialised solution,
          we’re ready to help.
        </p>
      </Reveal>

      <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-8">
        <a
          href="mailto:hello@Kayvion.com"
          className="flex items-center gap-3 text-lg text-text-primary hover:text-cyan-accent transition"
        >
          <HiMail className="text-2xl" /> hello@Kayvion.com
        </a>
        <div className="flex items-center gap-3 text-lg text-text-primary">
          <HiLocationMarker className="text-2xl text-cyan-accent" />
          Nairobi, Kenya (remote‑first)
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <a
          href="mailto:hello@Kayvion.com"
          className="inline-flex items-center gap-2 bg-cyan-accent text-ink font-semibold px-10 py-4 rounded-full hover:bg-cyan-400 transition"
        >
          Start a Conversation
        </a>
      </Reveal>
    </div>
  </section>
)

export default CTA
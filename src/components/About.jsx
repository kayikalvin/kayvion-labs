import Reveal from './Reveal'

const About = () => (
  <section id="about" className="py-24 bg-ink">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold">
          Technology That <span className="text-cyan-accent">Drives Results</span>
        </h2>
        <p className="mt-6 text-muted leading-relaxed">
          We are a team of engineers, data scientists and strategists dedicated to
          solving complex business challenges through technology. With deep expertise
          across AI, cloud, and enterprise software, we turn ambitious ideas into
          secure, scalable realities.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold text-cyan-accent">150+</div>
            <div className="text-muted text-sm">Projects Delivered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-accent">40+</div>
            <div className="text-muted text-sm">Industry Experts</div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="relative rounded-2xl overflow-hidden border border-subtle">
          {/* Replace with an image/graphic */}
          <div className="aspect-square bg-gradient-to-br from-blue-accent/20 to-indigo-accent/20 flex items-center justify-center text-muted text-6xl">
            🚀
          </div>
        </div>
      </Reveal>
    </div>
  </section>
)

export default About
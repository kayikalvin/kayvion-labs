import { HiCode, HiCloud, HiShieldCheck, HiChip, HiChartBar, HiCog } from 'react-icons/hi'
import Reveal from './Reveal'

const services = [
  {
    icon: <HiCode className="text-3xl text-cyan-accent" />,
    title: 'Software Engineering',
    desc: 'Custom enterprise systems, web & mobile apps, SaaS platforms built with modern stacks.',
  },
  {
    icon: <HiChip className="text-3xl text-cyan-accent" />,
    title: 'AI & Machine Learning',
    desc: 'Intelligent applications, predictive models, NLP, computer vision solutions.',
  },
  {
    icon: <HiChartBar className="text-3xl text-cyan-accent" />,
    title: 'Data Science & Analytics',
    desc: 'Actionable insights, dashboards, big data processing and visualisation.',
  },
  {
    icon: <HiCloud className="text-3xl text-cyan-accent" />,
    title: 'Cloud & DevOps',
    desc: 'Scalable cloud architecture, migration, CI/CD pipelines, and managed services.',
  },
  {
    icon: <HiShieldCheck className="text-3xl text-cyan-accent" />,
    title: 'Cybersecurity',
    desc: 'Risk assessment, penetration testing, compliance, and 24/7 monitoring.',
  },
  {
    icon: <HiCog className="text-3xl text-cyan-accent" />,
    title: 'Automation & Integration',
    desc: 'API development, system integration, business process automation.',
  },
]

const Services = () => (
  <section id="services" className="py-24 bg-surface">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Comprehensive{' '}
          <span className="text-cyan-accent">ICT Services</span>
        </h2>
        <p className="mt-4 text-muted text-center max-w-2xl mx-auto">
          From strategy to deployment, we cover every technology layer your
          organisation needs.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((srv, i) => (
          <Reveal key={i} className="group">
            <div className="h-full p-6 rounded-2xl bg-card border border-subtle hover:border-cyan-accent/50 transition-colors duration-300">
              <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-accent/10">
                {srv.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{srv.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{srv.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

export default Services
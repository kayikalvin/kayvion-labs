const Footer = () => (
  <footer className="bg-ink border-t border-subtle/50 py-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-muted text-sm">
      <p>© {new Date().getFullYear()} Kayvion. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-cyan-accent transition">Privacy</a>
        <a href="#" className="hover:text-cyan-accent transition">Terms</a>
        <a href="#" className="hover:text-cyan-accent transition">LinkedIn</a>
      </div>
    </div>
  </footer>
)

export default Footer
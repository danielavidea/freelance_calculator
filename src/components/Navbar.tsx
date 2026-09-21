import { useEffect, useState } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-black/5'
          : 'bg-white/40 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-lime font-black text-lg group-hover:rotate-6 transition-transform duration-300">
            i
          </span>
          <span className="text-xl font-extrabold tracking-tight text-forest">
            Idea Camp
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-forest/80">
          <a href="#work" className="hover:text-tangerine transition-colors duration-200">
            Our work
          </a>
          <a href="#services" className="hover:text-tangerine transition-colors duration-200">
            Services
          </a>
        </div>

        <a
          href="#cta"
          className="rounded-full bg-tangerine text-white text-sm font-bold px-5 py-2.5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-deepblue transition-all duration-200"
        >
          Get started
        </a>
      </nav>
    </header>
  );
}

export default Navbar;

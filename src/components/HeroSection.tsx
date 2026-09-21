import { useEffect, useState } from 'react';

const SWATCHES = [
  { name: 'Lime Green', hex: '#e2dc54' },
  { name: 'Forest Green', hex: '#266433' },
  { name: 'Mint Green', hex: '#d1efca' },
  { name: 'Deep Blue', hex: '#032f98' },
  { name: 'Sky Blue', hex: '#add0ee' },
  { name: 'Berry Purple', hex: '#6d2459' },
  { name: 'Tangerine', hex: '#f45c27' },
  { name: 'Lavender', hex: '#d1c4e9' },
];

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-mint">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-lavender/60 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sky/50 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div
          style={{ transform: `translateY(${scrollY * 0.25}px)`, opacity: Math.max(1 - scrollY / 500, 0) }}
          className="max-w-3xl"
        >
          <span className="inline-block rounded-full bg-white/70 text-forest text-xs font-bold tracking-wide uppercase px-4 py-1.5 mb-6 border border-forest/10">
            Creative + Marketing Agency
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-forest leading-[1.05]">
            Design &amp; marketing that{' '}
            <span className="text-tangerine">grows your business</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-forest/80 max-w-xl">
            We blend bold design with smart marketing strategy. Perfect for
            SMBs who want to stand out.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#cta"
              className="rounded-full bg-deepblue text-white font-bold px-7 py-3.5 shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:bg-berry transition-all duration-200"
            >
              Ready to grow?
            </a>
            <a
              href="#work"
              className="rounded-full border-2 border-forest/20 text-forest font-bold px-7 py-3.5 hover:border-forest hover:bg-white/50 transition-all duration-200"
            >
              See our work
            </a>
          </div>
        </div>

        <div
          style={{ transform: `translateY(${scrollY * 0.12}px)` }}
          className="mt-16 flex flex-wrap gap-3"
        >
          {SWATCHES.map((swatch) => (
            <div
              key={swatch.hex}
              title={swatch.name}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="text-[10px] font-semibold text-forest/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {swatch.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

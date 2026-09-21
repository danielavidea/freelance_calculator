import { useEffect, useRef, useState } from 'react';

interface Stat {
  label: string;
  target: number;
  suffix: string;
  color: string;
}

const STATS: Stat[] = [
  { label: 'SMBs helped', target: 50, suffix: '+', color: 'text-deepblue' },
  { label: 'Projects shipped', target: 200, suffix: '+', color: 'text-berry' },
  { label: 'Avg. growth impact', target: 280, suffix: '%', color: 'text-tangerine' },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const value = useCountUp(stat.target, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className={`text-5xl md:text-6xl font-extrabold tabular-nums ${stat.color}`}>
        {value}
        {stat.suffix}
      </div>
      <div className="mt-3 text-sm md:text-base font-semibold text-forest/70">
        {stat.label}
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12">
        {STATS.map((stat) => (
          <StatCounter key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

export default StatsSection;

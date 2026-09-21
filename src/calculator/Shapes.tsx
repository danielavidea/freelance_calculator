// Decorative shapes. All are hidden from assistive tech; fill and size come from CSS.

// A 12-lobed scalloped circle, drawn once.
const BURST_PATH = (() => {
  const lobes = 12;
  const steps = 180;
  let d = '';
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = 41 + 7 * Math.cos(lobes * t);
    d += `${i === 0 ? 'M' : 'L'}${(50 + r * Math.cos(t)).toFixed(1)} ${(50 + r * Math.sin(t)).toFixed(1)}`;
  }
  return `${d}Z`;
})();

export function Burst({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d={BURST_PATH} />
    </svg>
  );
}

export function HeaderArt() {
  return (
    <div className="art" aria-hidden="true">
      <Burst className="art-burst" />
      <span className="art-circle" />
      <span className="art-square" />
    </div>
  );
}

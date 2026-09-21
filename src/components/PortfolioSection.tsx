import { useState } from 'react';

type Category = 'All' | 'Branding' | 'Design' | 'Marketing';

interface Project {
  name: string;
  category: Exclude<Category, 'All'>;
  color: string;
  hex: string;
}

const PROJECTS: Project[] = [
  { name: 'Echo Wellness', category: 'Branding', color: 'Sky Blue', hex: '#add0ee' },
  { name: 'BuildNow', category: 'Marketing', color: 'Deep Blue', hex: '#032f98' },
  { name: 'Local Eats', category: 'Design', color: 'Forest Green', hex: '#266433' },
  { name: 'TechFlow', category: 'Marketing', color: 'Lime Green', hex: '#e2dc54' },
  { name: 'Artisan Co', category: 'Branding', color: 'Tangerine', hex: '#f45c27' },
  { name: 'Mindful', category: 'Design', color: 'Lavender', hex: '#d1c4e9' },
];

const FILTERS: Category[] = ['All', 'Branding', 'Design', 'Marketing'];

function textColorFor(hex: string) {
  return ['#e2dc54', '#d1efca', '#add0ee', '#d1c4e9'].includes(hex)
    ? 'text-forest'
    : 'text-white';
}

function PortfolioSection() {
  const [active, setActive] = useState<Category>('All');

  const filtered =
    active === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === active);

  return (
    <section id="work" className="bg-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-tangerine">
              Our work
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-forest tracking-tight">
              Case studies that show range
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActive(filter)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                  active === filter
                    ? 'bg-forest text-white shadow-md'
                    : 'bg-mint/60 text-forest/70 hover:bg-mint hover:text-forest'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.name}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              style={{ backgroundColor: project.hex }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className={`absolute inset-0 p-6 flex flex-col justify-between ${textColorFor(project.hex)}`}>
                <span className="self-start rounded-full bg-white/25 backdrop-blur-sm text-xs font-bold uppercase tracking-wide px-3 py-1">
                  {project.category}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold transition-transform duration-300 group-hover:-translate-y-1">
                    {project.name}
                  </h3>
                  <span className="text-xs font-semibold opacity-70">
                    {project.color}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;

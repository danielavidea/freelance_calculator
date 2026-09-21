interface Service {
  title: string;
  description: string;
  items: string[];
  bg: string;
  accent: string;
  text: string;
}

const SERVICES: Service[] = [
  {
    title: 'Strategic Design',
    description:
      'Logos, brands, and visual identities that make small businesses look (and feel) unmistakably themselves.',
    items: ['Logo & brand identity', 'Visual systems', 'Packaging & print'],
    bg: 'bg-lavender/40',
    accent: 'bg-berry',
    text: 'text-berry',
  },
  {
    title: 'Growth Marketing',
    description:
      'Campaigns, content, and funnels built to turn attention into customers — and customers into regulars.',
    items: ['Campaigns & content', 'Marketing funnels', 'Paid & organic strategy'],
    bg: 'bg-sky/40',
    accent: 'bg-deepblue',
    text: 'text-deepblue',
  },
];

function ServicesSection() {
  return (
    <section id="services" className="bg-mint/40 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold uppercase tracking-wide text-tangerine">
            What we do
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-forest tracking-tight">
            Two disciplines, one goal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className={`group rounded-3xl p-9 ${service.bg} border border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${service.accent} mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
              />
              <h3 className={`text-2xl font-extrabold ${service.text}`}>
                {service.title}
              </h3>
              <p className="mt-3 text-forest/75 leading-relaxed">
                {service.description}
              </p>
              <ul className="mt-6 space-y-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-forest/70"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${service.accent}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;

interface SocialIconProps {
  className?: string;
}

function InstagramGlyph({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinGlyph({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V23h-4v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V23h-4V8z" />
    </svg>
  );
}

function TwitterGlyph({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 2H22l-7.4 8.4L23.3 22H16.7l-5.2-6.8L5.6 22H2.5l7.9-9L1.7 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.7L7.3 4H5.5L17.7 20z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com', Glyph: InstagramGlyph },
  { label: 'LinkedIn', href: 'https://linkedin.com', Glyph: LinkedinGlyph },
  { label: 'Twitter', href: 'https://twitter.com', Glyph: TwitterGlyph },
];

function Footer() {
  return (
    <footer className="bg-forest py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <span className="text-lime font-extrabold tracking-tight">Idea Camp</span>
          <p className="mt-1 text-xs text-mint/60">
            &copy; {new Date().getFullYear()} Idea Camp. Founded by Videa &amp; Campos.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {SOCIALS.map(({ label, href, Glyph }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-mint hover:bg-tangerine hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              <Glyph className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

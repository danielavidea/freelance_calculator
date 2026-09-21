function CTASection() {
  return (
    <section id="cta" className="relative overflow-hidden bg-deepblue py-24">
      <div
        aria-hidden
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-tangerine/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-lime/20 blur-3xl"
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Ready to grow?
        </h2>
        <p className="mt-5 text-lg text-sky/90 max-w-xl mx-auto">
          Let's talk about your business and how Idea Camp can help you reach
          your goals.
        </p>
        <div className="mt-9">
          <a
            href="mailto:hello@ideacamp.co"
            className="inline-block rounded-full bg-tangerine text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-lime hover:text-forest transition-all duration-200"
          >
            Schedule a call
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;

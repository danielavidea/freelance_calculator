// All money in this file is in USD. Currency conversion happens at display time.

export type Billing = 'once' | 'monthly';
export type GroupId = 'once' | 'monthly' | 'addon';

export interface Service {
  id: string;
  group: GroupId;
  billing: Billing;
  name: string;
  detail: string;
  price: number;
}

export const GROUPS: { id: GroupId; title: string; blurb: string }[] = [
  { id: 'once', title: 'One-time projects', blurb: 'Pay once, delivered as a project.' },
  { id: 'monthly', title: 'Monthly retainers', blurb: 'Ongoing work, billed every month.' },
  { id: 'addon', title: 'Add-ons', blurb: 'One-time extras to pair with a project.' },
];

// Placeholder prices and scope descriptions: edit these to match your real offers.
// Prices can also be changed in the browser with "Edit my prices".
export const SERVICES: Service[] = [
  {
    id: 'logo',
    group: 'once',
    billing: 'once',
    name: 'Logo design',
    detail: 'Primary logo, two revision rounds, files for print and web.',
    price: 350,
  },
  {
    id: 'branding',
    group: 'once',
    billing: 'once',
    name: 'Branding package',
    detail: 'Logo, color palette, typography and a one-page brand guide.',
    price: 1200,
  },
  {
    id: 'landing',
    group: 'once',
    billing: 'once',
    name: 'Landing page',
    detail: 'One conversion-focused, mobile-ready page with a contact form.',
    price: 900,
  },
  {
    id: 'ecommerce',
    group: 'once',
    billing: 'once',
    name: 'E-commerce store',
    detail: 'Product catalog, cart and checkout for up to 25 products.',
    price: 3500,
  },
  {
    id: 'app',
    group: 'once',
    billing: 'once',
    name: 'Custom app',
    detail: 'Custom functionality built to your spec. Starting price; final cost is confirmed after scoping.',
    price: 6000,
  },
  {
    id: 'strategy',
    group: 'once',
    billing: 'once',
    name: 'Content strategy',
    detail: 'Audience research, content pillars and a 90-day plan.',
    price: 600,
  },
  {
    id: 'gbp-setup',
    group: 'once',
    billing: 'once',
    name: 'Google Business Profile setup',
    detail: 'Profile creation, verification, categories, services and photos.',
    price: 250,
  },
  {
    id: 'social',
    group: 'monthly',
    billing: 'monthly',
    name: 'Social media management',
    detail: 'Posting schedule, community replies and a monthly report.',
    price: 600,
  },
  {
    id: 'content',
    group: 'monthly',
    billing: 'monthly',
    name: 'Content creation',
    detail: 'Four blog posts or equivalent content pieces each month.',
    price: 800,
  },
  {
    id: 'seo',
    group: 'monthly',
    billing: 'monthly',
    name: 'SEO',
    detail: 'On-page improvements, keyword tracking and a monthly report.',
    price: 700,
  },
  {
    id: 'ads',
    group: 'monthly',
    billing: 'monthly',
    name: 'Paid ads management',
    detail: 'Campaign setup, optimization and reporting. Ad spend is not included.',
    price: 500,
  },
  {
    id: 'maintenance',
    group: 'monthly',
    billing: 'monthly',
    name: 'Website maintenance',
    detail: 'Updates, backups, security checks and uptime monitoring.',
    price: 150,
  },
  {
    id: 'gbp-manage',
    group: 'monthly',
    billing: 'monthly',
    name: 'Google Business Profile management',
    detail: 'Weekly posts, review replies and an insights report.',
    price: 200,
  },
  {
    id: 'adv-seo',
    group: 'addon',
    billing: 'once',
    name: 'Advanced SEO',
    detail: 'Technical audit, schema markup and site-speed fixes.',
    price: 450,
  },
  {
    id: 'blog',
    group: 'addon',
    billing: 'once',
    name: 'Blog setup',
    detail: 'Blog design, categories and three formatted starter posts.',
    price: 300,
  },
  {
    id: 'payments',
    group: 'addon',
    billing: 'once',
    name: 'Payment integration',
    detail: 'Stripe or PayPal checkout connected to your site.',
    price: 400,
  },
  {
    id: 'local-seo',
    group: 'addon',
    billing: 'once',
    name: 'Local SEO',
    detail: 'Citations, local landing pages and listing cleanup.',
    price: 350,
  },
  {
    id: 'cro',
    group: 'addon',
    billing: 'once',
    name: 'Conversion optimization (CRO)',
    detail: 'Funnel review, A/B test setup and written recommendations.',
    price: 600,
  },
  {
    id: 'copywriting',
    group: 'addon',
    billing: 'once',
    name: 'Copywriting',
    detail: 'Professional website copy for up to five pages.',
    price: 500,
  },
];

export type CurrencyCode = 'USD' | 'EUR' | 'ARS';

// Default rates are approximate and editable in the UI. Units per 1 USD.
export const CURRENCIES: Record<CurrencyCode, { label: string; symbol: string; defaultRate: number }> = {
  USD: { label: 'USD – US dollar', symbol: '$', defaultRate: 1 },
  EUR: { label: 'EUR – Euro', symbol: '€', defaultRate: 0.86 },
  ARS: { label: 'ARS – Argentine peso', symbol: 'AR$', defaultRate: 1450 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

// Hourly-rate calculator. Money fields are USD.
export interface RateInputs {
  fixedCosts: number;
  personalExpenses: number;
  profitMargin: number;
  weeklyHours: number;
  billablePct: number;
  vacationWeeks: number;
  taxPct: number;
}

export const DEFAULT_RATE_INPUTS: RateInputs = {
  fixedCosts: 400,
  personalExpenses: 1800,
  profitMargin: 20,
  weeklyHours: 40,
  billablePct: 60,
  vacationWeeks: 4,
  taxPct: 25,
};

export const PRESETS: { id: string; label: string; inputs: RateInputs }[] = [
  {
    id: 'student',
    label: 'Student',
    inputs: {
      fixedCosts: 100,
      personalExpenses: 900,
      profitMargin: 10,
      weeklyHours: 20,
      billablePct: 50,
      vacationWeeks: 4,
      taxPct: 10,
    },
  },
  {
    id: 'part-time',
    label: 'Part-time',
    inputs: {
      fixedCosts: 250,
      personalExpenses: 1200,
      profitMargin: 15,
      weeklyHours: 25,
      billablePct: 60,
      vacationWeeks: 4,
      taxPct: 20,
    },
  },
  { id: 'full-time', label: 'Full-time', inputs: DEFAULT_RATE_INPUTS },
  {
    id: 'agency',
    label: 'Agency',
    inputs: {
      fixedCosts: 2500,
      personalExpenses: 3500,
      profitMargin: 30,
      weeklyHours: 40,
      billablePct: 70,
      vacationWeeks: 3,
      taxPct: 30,
    },
  },
];

export const SCENARIO_NAMES = ['Conservative', 'Realistic', 'Optimistic'];
export const MAX_SCENARIOS = 6;
export const BILLABLE_WARNING_THRESHOLD = 75;
export const BILLABLE_WARNING_TEXT =
  "Most freelancers don't bill more than 75% of their time. Review this number before using this rate.";

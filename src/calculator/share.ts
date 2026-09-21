// Calculator state travels in the URL hash: #quote?s=logo,seo&cur=EUR or #rate?fc=400&...

export type Tab = 'quote' | 'rate';

export interface Hash {
  tab: Tab | null;
  params: URLSearchParams;
}

export function readHash(): Hash {
  const raw = window.location.hash.replace(/^#/, '');
  const [name = '', query = ''] = raw.split('?');
  const tab: Tab | null = name === 'quote' || name === 'rate' ? name : null;
  return { tab, params: new URLSearchParams(query) };
}

/** Builds a link to the current page with the given params. Empty values are dropped. */
export function buildLink(tab: Tab, values: Record<string, string | undefined>): string {
  const query = Object.entries(values)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string).replace(/%2C/g, ',').replace(/%3A/g, ':')}`)
    .join('&');
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#${tab}${query ? `?${query}` : ''}`;
}

export function parseList(value: string | null): string[] {
  return value ? value.split(',').filter(Boolean) : [];
}

export function parsePrices(value: string | null): Record<string, number> {
  const out: Record<string, number> = {};
  for (const pair of parseList(value)) {
    const [id, raw] = pair.split(':');
    const n = Number(raw);
    if (id && Number.isFinite(n) && n >= 0) out[id] = n;
  }
  return out;
}

export function parseNumber(value: string | null, min: number, max: number): number | undefined {
  if (value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : undefined;
}

import { CURRENCIES, type CurrencyCode } from './data';

export interface Money {
  code: CurrencyCode;
  symbol: string;
  /** units of this currency per 1 USD */
  fx: number;
  /** USD -> display units (whole units once converted) */
  toDisplay: (usd: number) => number;
  /** display units -> USD */
  toUsd: (display: number) => number;
  fmt: (n: number, decimals?: number) => string;
  /** hourly rates read better with cents, except in high-denomination currencies */
  rateDecimals: number;
}

export function formatNumber(n: number, maxDecimals = 0): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxDecimals });
}

export function makeMoney(code: CurrencyCode, fx: number): Money {
  const { symbol } = CURRENCIES[code];
  const rate = fx > 0 ? fx : 1;
  return {
    code,
    symbol,
    fx: rate,
    toDisplay: (usd) => (rate === 1 ? usd : Math.round(usd * rate)),
    toUsd: (display) => display / rate,
    fmt: (n, decimals = 0) =>
      `${n < 0 ? '-' : ''}${symbol}${Math.abs(n).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`,
    rateDecimals: code === 'ARS' ? 0 : 2,
  };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Rounds x to 1, 2 or 5 times a power of ten: a friendly slider step. */
export function niceStep(x: number): number {
  const p = 10 ** Math.floor(Math.log10(x));
  const r = x / p;
  return p * (r >= 5 ? 5 : r >= 2 ? 2 : 1);
}

export function todayLong(): string {
  return new Date().toLocaleDateString('en-US', { dateStyle: 'long' });
}

export function todayISO(): string {
  return new Date().toLocaleDateString('en-CA');
}

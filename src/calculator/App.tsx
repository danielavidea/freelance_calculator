import { useState } from 'react';
import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from './data';
import { makeMoney } from './format';
import { NumberBox } from './NumberBox';
import QuoteCalculator from './QuoteCalculator';
import RateCalculator from './RateCalculator';
import { parseNumber, readHash, type Tab } from './share';
import { HeaderArt } from './Shapes';
import { useStored } from './useStored';

const DEFAULT_RATES = Object.fromEntries(
  CURRENCY_CODES.map((c) => [c, CURRENCIES[c].defaultRate]),
) as Record<CurrencyCode, number>;

export default function App() {
  const [hash] = useState(readHash);
  // Client links hide the owner-only tools and never write to this browser's saved settings.
  const clientMode = hash.params.get('v') === 'client';

  const [tab, setTab] = useState<Tab>(clientMode ? 'quote' : (hash.tab ?? 'quote'));

  const linkCurrency = CURRENCY_CODES.find((c) => c === hash.params.get('cur'));
  const [currency, setCurrency] = useStored<CurrencyCode>('calc.currency', 'USD', {
    seed: linkCurrency,
    persist: !clientMode,
  });
  const [savedRates, setSavedRates] = useStored<Record<CurrencyCode, number>>('calc.rates', DEFAULT_RATES, {
    persist: !clientMode,
  });
  const [linkRates, setLinkRates] = useState<Partial<Record<CurrencyCode, number>>>(() => {
    const fx = parseNumber(hash.params.get('fx'), 0.0001, 10_000_000);
    return linkCurrency && fx !== undefined ? { [linkCurrency]: fx } : {};
  });

  const fx = linkRates[currency] ?? savedRates[currency] ?? DEFAULT_RATES[currency];
  const money = makeMoney(currency, fx);

  function changeRate(value: number) {
    if (!(value > 0)) return;
    setLinkRates((r) => ({ ...r, [currency]: undefined }));
    setSavedRates((r) => ({ ...DEFAULT_RATES, ...r, [currency]: value }));
  }

  return (
    <div className="app">
      <header className="site-header no-print">
        <div className="wrap">
          <HeaderArt />
          <h1>
            {clientMode ? 'Project' : 'Pricing'} <em>{clientMode ? 'quote' : 'calculators'}</em>
          </h1>
          <p className="lede">
            {clientMode
              ? 'Choose the services you need and see exactly what each one costs.'
              : 'Build a quote for a client, or work out the hourly rate your business needs.'}
          </p>

          <div className="header-row">
            {!clientMode && (
              <div className="tabs" role="tablist" aria-label="Calculators">
                <button
                  type="button"
                  role="tab"
                  id="tab-quote"
                  aria-selected={tab === 'quote'}
                  aria-controls="panel-quote"
                  onClick={() => setTab('quote')}
                >
                  Quick quote
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-rate"
                  aria-selected={tab === 'rate'}
                  aria-controls="panel-rate"
                  onClick={() => setTab('rate')}
                >
                  Hourly rate
                </button>
              </div>
            )}

            <div className="currency">
              <label>
                <span>Currency</span>
                <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
                  {CURRENCY_CODES.map((c) => (
                    <option key={c} value={c}>
                      {CURRENCIES[c].label}
                    </option>
                  ))}
                </select>
              </label>
              {currency !== 'USD' &&
                (clientMode ? (
                  <p className="fx-note">
                    Converted at 1 USD = {fx} {currency}.
                  </p>
                ) : (
                  <div className="fx">
                    <span id="fx-label">1 USD =</span>
                    <NumberBox
                      ariaLabel={`Exchange rate: ${currency} per 1 USD`}
                      value={fx}
                      step={0.01}
                      min={0.0001}
                      suffix={currency}
                      onChange={changeRate}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </header>

      <main className="wrap">
        <div role="tabpanel" id="panel-quote" aria-labelledby="tab-quote" hidden={tab !== 'quote'}>
          <QuoteCalculator money={money} clientMode={clientMode} hash={hash} />
        </div>
        {!clientMode && (
          <div role="tabpanel" id="panel-rate" aria-labelledby="tab-rate" hidden={tab !== 'rate'}>
            <RateCalculator money={money} hash={hash} />
          </div>
        )}
      </main>
    </div>
  );
}

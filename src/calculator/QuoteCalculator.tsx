import { useState } from 'react';
import logo from './assets/idea-basecamp-logo.png';
import { GROUPS, SERVICES, type GroupId, type Service } from './data';
import { round2, todayISO, todayLong, type Money } from './format';
import { NumberBox } from './NumberBox';
import { printAs } from './print';
import { buildLink, parseList, parsePrices, type Hash } from './share';
import { ShareButton } from './ShareButton';
import { Burst } from './Shapes';
import { useStored } from './useStored';

const GROUP_LOOK: Record<GroupId, { tone: string; glyph: string }> = {
  once: { tone: 'lime', glyph: '1×' },
  monthly: { tone: 'lav', glyph: '↻' },
  addon: { tone: 'orange', glyph: '+' },
};

interface Props {
  money: Money;
  clientMode: boolean;
  hash: Hash;
}

interface Line {
  service: Service;
  price: number;
}

export default function QuoteCalculator({ money, clientMode, hash }: Props) {
  const { fmt, toDisplay, toUsd, symbol } = money;

  const [selected, setSelected] = useState<string[]>(() =>
    parseList(hash.params.get('s')).filter((id) => SERVICES.some((s) => s.id === id)),
  );
  // Prices the owner has changed, in USD, keyed by service id.
  const [prices, setPrices] = useStored<Record<string, number>>('calc.prices', {}, {
    seed: hash.params.has('p') ? parsePrices(hash.params.get('p')) : undefined,
    persist: !clientMode,
  });
  const [preparedBy, setPreparedBy] = useStored<string>('calc.preparedBy', '', {
    seed: hash.params.get('by') ?? undefined,
    persist: !clientMode,
  });
  const [preparedFor, setPreparedFor] = useState('');
  const [editing, setEditing] = useState(false);

  const usdPrice = (s: Service) => prices[s.id] ?? s.price;
  const isSelected = (id: string) => selected.includes(id);

  const lines: Line[] = SERVICES.filter((s) => isSelected(s.id)).map((service) => ({
    service,
    price: toDisplay(usdPrice(service)),
  }));
  const onceLines = lines.filter((l) => l.service.billing === 'once');
  const monthlyLines = lines.filter((l) => l.service.billing === 'monthly');
  const sum = (ls: Line[]) => ls.reduce((total, l) => total + l.price, 0);
  const onceTotal = sum(onceLines);
  const monthlyTotal = sum(monthlyLines);
  const firstYear = onceTotal + monthlyTotal * 12;

  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const shareLink = () =>
    buildLink('quote', {
      v: 'client',
      s: lines.map((l) => l.service.id).join(','),
      p: lines.map((l) => `${l.service.id}:${round2(usdPrice(l.service))}`).join(','),
      cur: money.code,
      fx: money.code === 'USD' ? undefined : String(money.fx),
      by: preparedBy || undefined,
    });

  const hasPriceEdits = Object.keys(prices).length > 0;
  const empty = lines.length === 0;

  return (
    <>
      <div className="screen no-print">
        <div className="quote-layout">
          <section className="area-catalog" aria-labelledby="quote-title">
            <div className="section-head">
              <h2 id="quote-title">
                {clientMode ? 'Your' : 'Quick'} <em>{clientMode ? 'services' : 'quote'}</em>
              </h2>
              <p>{clientMode ? 'Tick what you need.' : 'Choose the services you need.'} Your estimate updates as you go.</p>
            </div>

            {!clientMode && (
              <div className="owner-tools">
                <button
                  type="button"
                  className="btn btn-small"
                  aria-pressed={editing}
                  onClick={() => setEditing((e) => !e)}
                >
                  {editing ? 'Done editing prices' : 'Edit my prices'}
                </button>
                {hasPriceEdits && (
                  <button type="button" className="btn btn-small" onClick={() => setPrices({})}>
                    Reset prices
                  </button>
                )}
                {editing && (
                  <p className="help">
                    Prices are in {money.code} and saved in this browser. Client links carry the prices you set.
                  </p>
                )}
              </div>
            )}

            {GROUPS.map((group) => (
              <fieldset className={`group tone-${GROUP_LOOK[group.id].tone}`} key={group.id}>
                <legend>
                  <span className="badge" aria-hidden="true">
                    <Burst />
                    <b>{GROUP_LOOK[group.id].glyph}</b>
                  </span>
                  <span>
                    <span className="group-title">{group.title}</span>
                    <span className="group-blurb">{group.blurb}</span>
                  </span>
                </legend>
                <ul className="svc-list">
                  {SERVICES.filter((s) => s.group === group.id).map((s) => {
                    const checked = isSelected(s.id);
                    const price = toDisplay(usdPrice(s));
                    const text = (
                      <span className="svc-text">
                        <span className="svc-name">{s.name}</span>
                        <span className="svc-detail">{s.detail}</span>
                      </span>
                    );
                    const box = (
                      <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                    );
                    return (
                      <li key={s.id} className={checked ? 'svc is-on' : 'svc'}>
                        {editing ? (
                          <div className="svc-row">
                            <label className="svc-main">
                              {box}
                              {text}
                            </label>
                            <NumberBox
                              value={price}
                              ariaLabel={`Price for ${s.name}`}
                              prefix={symbol}
                              suffix={s.billing === 'monthly' ? '/mo' : undefined}
                              onChange={(v) => setPrices((p) => ({ ...p, [s.id]: toUsd(v) }))}
                            />
                          </div>
                        ) : (
                          <label className="svc-row">
                            {box}
                            {text}
                            <span className="svc-price">
                              {fmt(price)}
                              {s.billing === 'monthly' && <small>/mo</small>}
                            </span>
                          </label>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ))}
          </section>

          <aside className="area-summary" aria-labelledby="summary-title">
            <div className="card tone-teal is-dark summary">
              <h2 id="summary-title" className="card-title">
                Your <em>estimate</em>
              </h2>

              <div className="totals" aria-live="polite">
                <div className="total-row">
                  <span>One-time total</span>
                  <strong>{fmt(onceTotal)}</strong>
                </div>
                <div className="total-row">
                  <span>Monthly total</span>
                  <strong>
                    {fmt(monthlyTotal)}
                    <small>/mo</small>
                  </strong>
                </div>
                <div className="total-row total-main">
                  <span>First-year estimate</span>
                  <strong className="accent">{fmt(firstYear)}</strong>
                </div>
                <p className="help">First year = one-time total + 12 months of retainers.</p>
              </div>

              <h3 className="eyebrow">Breakdown</h3>
              {empty ? (
                <p className="empty">Nothing selected yet. Tick a service to see what it costs.</p>
              ) : (
                <div className="breakdown">
                  {onceLines.length > 0 && (
                    <div>
                      <h4>One-time</h4>
                      <ul>
                        {onceLines.map((l) => (
                          <li key={l.service.id}>
                            <span>{l.service.name}</span>
                            <span>{fmt(l.price)}</span>
                          </li>
                        ))}
                        <li className="subtotal">
                          <span>Subtotal</span>
                          <span>{fmt(onceTotal)}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  {monthlyLines.length > 0 && (
                    <div>
                      <h4>Monthly</h4>
                      <ul>
                        {monthlyLines.map((l) => (
                          <li key={l.service.id}>
                            <span>{l.service.name}</span>
                            <span>
                              {fmt(l.price)}/mo · {fmt(l.price * 12)}/yr
                            </span>
                          </li>
                        ))}
                        <li className="subtotal">
                          <span>Subtotal</span>
                          <span>
                            {fmt(monthlyTotal)}/mo · {fmt(monthlyTotal * 12)}/yr
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="quote-names">
                <label>
                  <span>Prepared for</span>
                  <input
                    type="text"
                    value={preparedFor}
                    placeholder="Client name (optional)"
                    onChange={(e) => setPreparedFor(e.target.value)}
                  />
                </label>
                <label>
                  <span>Prepared by</span>
                  <input
                    type="text"
                    value={preparedBy}
                    placeholder="Your name or business (optional)"
                    onChange={(e) => setPreparedBy(e.target.value)}
                  />
                </label>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={empty}
                  onClick={() => printAs(`Quote ${todayISO()}`)}
                >
                  Download PDF quote
                </button>
                <ShareButton label={clientMode ? 'Copy quote link' : 'Copy client link'} getLink={shareLink} />
                {!empty && (
                  <button type="button" className="btn btn-quiet" onClick={() => setSelected([])}>
                    Clear selection
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>

        <div className="bar" aria-hidden="true">
          <span>First-year estimate</span>
          <strong className="accent">{fmt(firstYear)}</strong>
        </div>
      </div>

      <div className="print-only quote-sheet">
        <header className="qs-top">
          <img className="qs-logo" src={logo} alt="Idea Basecamp" />
          <h1>QUOTE</h1>
        </header>

        <div className="qs-meta">
          <div>
            {preparedFor && (
              <>
                <span className="qs-label">Quote to:</span>
                <span className="qs-client">{preparedFor}</span>
              </>
            )}
          </div>
          <div className="qs-est">
            <span className="qs-label">Estimate</span>
            <span className="qs-est-amount">{fmt(firstYear)}</span>
            <span className="qs-date">Date: {todayLong()}</span>
          </div>
        </div>

        <table className="qs-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="c">Qty</th>
              <th className="r">Price</th>
              <th className="r">Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => {
              const monthly = l.service.billing === 'monthly';
              return (
                <tr key={l.service.id}>
                  <td>
                    <span className="qs-name">{l.service.name}</span>
                    <span className="qs-detail">{l.service.detail}</span>
                  </td>
                  <td className="c">{monthly ? '12 mo' : '1'}</td>
                  <td className="r">
                    {fmt(l.price)}
                    {monthly ? '/mo' : ''}
                  </td>
                  <td className="r">{fmt(monthly ? l.price * 12 : l.price)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="qs-bottom">
          <div className="qs-totals">
            {onceTotal > 0 && (
              <div>
                <span>One-time total</span>
                <span>{fmt(onceTotal)}</span>
              </div>
            )}
            {monthlyTotal > 0 && (
              <div>
                <span>Monthly retainers (12 months)</span>
                <span>{fmt(monthlyTotal * 12)}</span>
              </div>
            )}
            <div className="qs-grand">
              <span>Estimate</span>
              <span>{fmt(firstYear)}</span>
            </div>
            <p className="qs-note">
              {monthlyTotal > 0 && `Retainers are ${fmt(monthlyTotal)} per month. `}
              Amounts in {money.code}.
            </p>
          </div>
        </div>

        <footer className="qs-foot">
          <span className="qs-thanks">Thank you for your interest!</span>
          {preparedBy && (
            <span className="qs-by">
              <strong>{preparedBy}</strong>
              <span>Prepared by</span>
            </span>
          )}
        </footer>
      </div>
    </>
  );
}

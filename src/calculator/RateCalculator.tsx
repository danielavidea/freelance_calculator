import { useState } from 'react';
import {
  BILLABLE_WARNING_TEXT,
  BILLABLE_WARNING_THRESHOLD,
  DEFAULT_RATE_INPUTS,
  MAX_SCENARIOS,
  PRESETS,
  SCENARIO_NAMES,
  type RateInputs,
} from './data';
import { Field } from './Field';
import { formatNumber, niceStep, round2, todayISO, todayLong, type Money } from './format';
import { printAs } from './print';
import { calcRate, type RateResult } from './rate';
import { buildLink, parseNumber, type Hash } from './share';
import { ShareButton } from './ShareButton';
import { Burst } from './Shapes';
import { useStored } from './useStored';

// Pastel backgrounds cycle through these, so neighbours never match.
const STEP_TONES = ['lime', 'orange', 'sky', 'lav', 'purple'];
const SCENARIO_TONES = ['sky', 'lime', 'lav', 'orange', 'blush', 'sky'];

interface Props {
  money: Money;
  hash: Hash;
}

interface Scenario {
  id: string;
  name: string;
  inputs: RateInputs; // money fields in USD
}

interface Step {
  title: string;
  formula: string;
  result: string;
}

const INPUT_KEYS: [keyof RateInputs, string, number, number][] = [
  ['fixedCosts', 'fc', 0, 1_000_000_000],
  ['personalExpenses', 'pe', 0, 1_000_000_000],
  ['profitMargin', 'pm', 0, 500],
  ['weeklyHours', 'hw', 0, 100],
  ['billablePct', 'bp', 0, 100],
  ['vacationWeeks', 'vw', 0, 51],
  ['taxPct', 'tx', 0, 90],
];

function inputsFromHash(hash: Hash): RateInputs | undefined {
  if (hash.tab !== 'rate') return undefined;
  const next = { ...DEFAULT_RATE_INPUTS };
  let found = false;
  for (const [key, param, min, max] of INPUT_KEYS) {
    const n = parseNumber(hash.params.get(param), min, max);
    if (n !== undefined) {
      next[key] = n;
      found = true;
    }
  }
  return found ? next : undefined;
}

function sameInputs(a: RateInputs, b: RateInputs) {
  return INPUT_KEYS.every(([k]) => a[k] === b[k]);
}

export default function RateCalculator({ money, hash }: Props) {
  const { fmt, toDisplay, toUsd, symbol } = money;

  const [inputs, setInputs] = useStored<RateInputs>('calc.rate', DEFAULT_RATE_INPUTS, {
    seed: inputsFromHash(hash),
  });
  const [scenarios, setScenarios] = useStored<Scenario[]>('calc.scenarios', []);
  const [scenarioName, setScenarioName] = useState('');

  // Everything below works in display units so the numbers on screen always agree with each other.
  const toView = (i: RateInputs): RateInputs => ({
    ...i,
    fixedCosts: toDisplay(i.fixedCosts),
    personalExpenses: toDisplay(i.personalExpenses),
  });
  const view = toView(inputs);
  const r = calcRate(view);

  const set = (key: keyof RateInputs) => (v: number) => setInputs((p) => ({ ...p, [key]: v }));
  const setMoney = (key: 'fixedCosts' | 'personalExpenses') => (v: number) =>
    setInputs((p) => ({ ...p, [key]: toUsd(v) }));

  const moneyStep = niceStep(25 * money.fx);
  const snap = (usd: number) => Math.round((usd * money.fx) / moneyStep) * moneyStep;

  const billableTooHigh = inputs.billablePct > BILLABLE_WARNING_THRESHOLD;
  const rateText = r.hourlyRate === null ? '—' : fmt(r.hourlyRate, money.rateDecimals);
  const hrs = (n: number) => formatNumber(n, 1);

  const steps = buildSteps(view, r, money, hrs);

  const activePreset = PRESETS.find((p) => sameInputs(p.inputs, inputs));

  function saveScenario() {
    if (scenarios.length >= MAX_SCENARIOS) return;
    const name = scenarioName.trim() || `Scenario ${scenarios.length + 1}`;
    setScenarios((list) => [...list, { id: `${Date.now()}-${list.length}`, name, inputs }]);
    setScenarioName('');
  }

  const shareLink = () =>
    buildLink('rate', {
      fc: String(round2(inputs.fixedCosts)),
      pe: String(round2(inputs.personalExpenses)),
      pm: String(inputs.profitMargin),
      hw: String(inputs.weeklyHours),
      bp: String(inputs.billablePct),
      vw: String(inputs.vacationWeeks),
      tx: String(inputs.taxPct),
      cur: money.code,
      fx: money.code === 'USD' ? undefined : String(money.fx),
    });

  return (
    <>
      <div className="screen no-print">
        <div className="rate-layout">
          <section className="area-presets" aria-labelledby="rate-title">
            <div className="section-head">
              <h2 id="rate-title">
                Hourly rate <em>calculator</em>
              </h2>
              <p>Work out the rate your business needs, step by step. Every field below can be changed.</p>
            </div>
            <div className="chips" role="group" aria-label="Quick presets">
              <span className="chips-label">Start from</span>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="chip"
                  aria-pressed={activePreset?.id === p.id}
                  onClick={() => setInputs({ ...p.inputs })}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          <section className="area-inputs" aria-label="Your numbers">
            <div className="tiles">
              <Field
                id="fixed"
                label="Monthly fixed business costs"
                help="Software, hosting, insurance, coworking: what the business costs to run."
                value={view.fixedCosts}
                onChange={setMoney('fixedCosts')}
                min={0}
                max={snap(3000)}
                step={moneyStep}
                prefix={symbol}
                valueText={fmt(view.fixedCosts)}
                tone="sky"
              />
              <Field
                id="personal"
                label="Personal monthly expenses"
                help="Rent, food, transport and everything else you need to live."
                value={view.personalExpenses}
                onChange={setMoney('personalExpenses')}
                min={0}
                max={snap(6000)}
                step={moneyStep}
                prefix={symbol}
                valueText={fmt(view.personalExpenses)}
                tone="lime"
              />
              <Field
                id="margin"
                label="Desired profit margin"
                help="Extra on top of expenses, for savings, growth and slow months."
                value={inputs.profitMargin}
                onChange={set('profitMargin')}
                min={0}
                max={100}
                step={1}
                hardMax={500}
                suffix="%"
                valueText={`${inputs.profitMargin} percent`}
                tone="orange"
              />
              <Field
                id="hours"
                label="Hours worked per week"
                help="Everything: client work, admin, sales, learning."
                value={inputs.weeklyHours}
                onChange={set('weeklyHours')}
                min={1}
                max={80}
                step={1}
                hardMax={100}
                suffix="hrs"
                valueText={`${inputs.weeklyHours} hours`}
                tone="lav"
              />
              <Field
                id="billable"
                label="Billable share of those hours"
                help="The part you can actually invoice. The rest is admin, sales and unpaid revisions."
                value={inputs.billablePct}
                onChange={set('billablePct')}
                min={0}
                max={100}
                step={1}
                suffix="%"
                valueText={`${inputs.billablePct} percent`}
                tone="sky"
              >
                {billableTooHigh && (
                  <div className="warn" role="alert">
                    <span className="warn-icon" aria-hidden="true">
                      !
                    </span>
                    <p>{BILLABLE_WARNING_TEXT}</p>
                  </div>
                )}
              </Field>
              <Field
                id="vacation"
                label="Weeks off per year"
                help="Vacation, holidays and sick days."
                value={inputs.vacationWeeks}
                onChange={set('vacationWeeks')}
                min={0}
                max={20}
                step={1}
                hardMax={51}
                suffix="wks"
                valueText={`${inputs.vacationWeeks} weeks`}
                tone="lime"
              />
              <Field
                id="tax"
                label="Tax and withholding"
                help="The share of gross income you set aside for taxes."
                value={inputs.taxPct}
                onChange={set('taxPct')}
                min={0}
                max={60}
                step={1}
                hardMax={90}
                suffix="%"
                valueText={`${inputs.taxPct} percent`}
                tone="blush"
              />
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => setInputs({ ...DEFAULT_RATE_INPUTS })}
              >
                Reset to defaults
              </button>
            </div>
          </section>

          <section className="card area-steps" aria-labelledby="steps-title">
            <h2 id="steps-title" className="card-title">
              How it was <em>calculated</em>
            </h2>
            <StepList steps={steps} />
          </section>

          <aside className="card tone-berry is-dark area-results" aria-labelledby="result-title">
            <div className="hero-top">
              <h2 id="result-title" className="eyebrow">
                Your hourly rate
              </h2>
              <Burst className="hero-burst" />
            </div>
            <p className="hero" aria-live="polite">
              <span className="accent">{rateText}</span>
              {r.hourlyRate !== null && <small>/hr</small>}
            </p>
            {r.hourlyRate === null && (
              <p className="help">Enter some billable hours to calculate a rate.</p>
            )}

            <dl className="metrics">
              <div>
                <dt>Daily rate (8-hour day)</dt>
                <dd>{r.dailyRate === null ? '—' : fmt(r.dailyRate)}</dd>
              </div>
              <div>
                <dt>Monthly revenue needed</dt>
                <dd>{fmt(r.monthlyRevenue)}</dd>
              </div>
              <div>
                <dt>Real billable hours per week</dt>
                <dd>{hrs(r.weeklyBillableHours)} hrs</dd>
              </div>
            </dl>

            {billableTooHigh && (
              <div className="warn">
                <span className="warn-icon" aria-hidden="true">
                  !
                </span>
                <p>{BILLABLE_WARNING_TEXT}</p>
              </div>
            )}

            <div className="actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => printAs(`Rate sheet ${todayISO()}`)}
              >
                Download PDF rate sheet
              </button>
              <ShareButton label="Copy share link" getLink={shareLink} />
            </div>
          </aside>

          <section className="area-scenarios" aria-labelledby="scen-title">
            <div className="section-head">
              <h2 id="scen-title">
                Compare <em>scenarios</em>
              </h2>
              <p>Save the current numbers, change them, save again, and compare side by side.</p>
            </div>
            <div className="card save-scenario">
              <label htmlFor="scenario-name" className="field-label">
                Name this scenario
              </label>
              <div className="chips">
                {SCENARIO_NAMES.map((n) => (
                  <button key={n} type="button" className="chip" onClick={() => setScenarioName(n)}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="save-row">
                <input
                  id="scenario-name"
                  type="text"
                  value={scenarioName}
                  placeholder={`Scenario ${scenarios.length + 1}`}
                  onChange={(e) => setScenarioName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveScenario()}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={scenarios.length >= MAX_SCENARIOS}
                  onClick={saveScenario}
                >
                  Save scenario
                </button>
              </div>
              {scenarios.length >= MAX_SCENARIOS && (
                <p className="help">You can keep up to {MAX_SCENARIOS} scenarios. Delete one to save another.</p>
              )}
            </div>

            {scenarios.length === 0 ? (
              <p className="empty">No saved scenarios yet.</p>
            ) : (
              <div className="scenario-grid">
                {scenarios.map((s, i) => (
                  <ScenarioCard
                    key={s.id}
                    tone={SCENARIO_TONES[i % SCENARIO_TONES.length]}
                    scenario={s}
                    view={toView(s.inputs)}
                    money={money}
                    onLoad={() => setInputs({ ...s.inputs })}
                    onDelete={() => setScenarios((list) => list.filter((x) => x.id !== s.id))}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="bar" aria-hidden="true">
          <span>Hourly rate</span>
          <strong className="accent">
            {rateText}
            {r.hourlyRate !== null && <small>/hr</small>}
          </strong>
        </div>
      </div>

      <div className="print-only sheet">
        <h1>Hourly rate sheet</h1>
        <p className="sheet-meta">
          {todayLong()} · Amounts in {money.code}
        </p>
        <p className="sheet-hero">
          <span className="accent">{rateText}</span>
          {r.hourlyRate !== null && ' per hour'}
        </p>
        <table className="sheet-totals">
          <tbody>
            <tr>
              <td>Daily rate (8-hour day)</td>
              <td className="r">{r.dailyRate === null ? '—' : fmt(r.dailyRate)}</td>
            </tr>
            <tr>
              <td>Monthly revenue needed</td>
              <td className="r">{fmt(r.monthlyRevenue)}</td>
            </tr>
            <tr>
              <td>Real billable hours per week</td>
              <td className="r">{hrs(r.weeklyBillableHours)} hrs</td>
            </tr>
          </tbody>
        </table>
        {billableTooHigh && <p className="sheet-warn">Warning: {BILLABLE_WARNING_TEXT}</p>}

        <h2>Assumptions</h2>
        <table>
          <tbody>
            <AssumptionRows view={view} money={money} />
          </tbody>
        </table>

        <h2>How it was calculated</h2>
        <table>
          <tbody>
            {steps.map((s, i) => (
              <tr key={s.title}>
                <td>
                  {i + 1}. <strong>{s.title}</strong>
                </td>
                <td>{s.formula}</td>
                <td className="r">
                  <strong>{s.result}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {scenarios.length > 0 && (
          <>
            <h2>Scenarios</h2>
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="r">Hourly rate</th>
                  <th className="r">Daily rate</th>
                  <th className="r">Monthly revenue</th>
                  <th className="r">Billable</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => {
                  const sv = toView(s.inputs);
                  const sr = calcRate(sv);
                  return (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td className="r">{sr.hourlyRate === null ? '—' : fmt(sr.hourlyRate, money.rateDecimals)}</td>
                      <td className="r">{sr.dailyRate === null ? '—' : fmt(sr.dailyRate)}</td>
                      <td className="r">{fmt(sr.monthlyRevenue)}</td>
                      <td className="r">{s.inputs.billablePct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

function buildSteps(v: RateInputs, r: RateResult, money: Money, hrs: (n: number) => string): Step[] {
  const { fmt } = money;
  return [
    {
      title: 'Working weeks',
      formula: `52 − ${v.vacationWeeks} weeks off`,
      result: `${formatNumber(r.workingWeeks)} weeks`,
    },
    {
      title: 'Annual billable hours',
      formula: `${formatNumber(v.weeklyHours, 1)} hrs × ${v.billablePct}% × ${formatNumber(r.workingWeeks)} weeks`,
      result: `${hrs(r.annualBillableHours)} hours`,
    },
    {
      title: 'Annual cost',
      formula: `(${fmt(v.fixedCosts)} + ${fmt(v.personalExpenses)}) × 12`,
      result: fmt(r.annualCost),
    },
    {
      title: 'Target income',
      formula: `${fmt(r.annualCost)} × (1 + ${v.profitMargin}%)`,
      result: fmt(r.targetIncome),
    },
    {
      title: 'Gross income needed',
      formula: `${fmt(r.targetIncome)} ÷ (1 − ${v.taxPct}%)`,
      result: fmt(r.grossIncome),
    },
    {
      title: 'Hourly rate',
      formula: `${fmt(r.grossIncome)} ÷ ${hrs(r.annualBillableHours)} hours`,
      result: r.hourlyRate === null ? '—' : `${fmt(r.hourlyRate, money.rateDecimals)}/hr`,
    },
  ];
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={`step tone-${STEP_TONES[i % STEP_TONES.length]}${i === steps.length - 1 ? ' step-last' : ''}`}
        >
          <span className="step-n" aria-hidden="true">
            <Burst />
            <b>{i + 1}</b>
          </span>
          <div className="step-body">
            <span className="step-title">{s.title}</span>
            <span className="step-formula">{s.formula}</span>
          </div>
          <span className="step-result">{s.result}</span>
        </li>
      ))}
    </ol>
  );
}

function AssumptionRows({ view, money }: { view: RateInputs; money: Money }) {
  const rows: [string, string][] = [
    ['Monthly fixed business costs', money.fmt(view.fixedCosts)],
    ['Personal monthly expenses', money.fmt(view.personalExpenses)],
    ['Desired profit margin', `${view.profitMargin}%`],
    ['Hours worked per week', `${formatNumber(view.weeklyHours, 1)}`],
    ['Billable share of hours', `${view.billablePct}%`],
    ['Weeks off per year', `${view.vacationWeeks}`],
    ['Tax and withholding', `${view.taxPct}%`],
  ];
  return (
    <>
      {rows.map(([label, value]) => (
        <tr key={label}>
          <td>{label}</td>
          <td className="r">{value}</td>
        </tr>
      ))}
    </>
  );
}

interface CardProps {
  tone: string;
  scenario: Scenario;
  view: RateInputs;
  money: Money;
  onLoad: () => void;
  onDelete: () => void;
}

function ScenarioCard({ tone, scenario, view, money, onLoad, onDelete }: CardProps) {
  const r = calcRate(view);
  const { fmt } = money;
  const rows: [string, string][] = [
    ['Daily rate', r.dailyRate === null ? '—' : fmt(r.dailyRate)],
    ['Monthly revenue', fmt(r.monthlyRevenue)],
    ['Billable hrs / week', `${formatNumber(r.weeklyBillableHours, 1)}`],
    ['Billable share', `${view.billablePct}%`],
    ['Profit margin', `${view.profitMargin}%`],
    ['Tax', `${view.taxPct}%`],
    ['Hours / week', `${formatNumber(view.weeklyHours, 1)}`],
    ['Weeks off', `${view.vacationWeeks}`],
    ['Fixed costs', fmt(view.fixedCosts)],
    ['Personal expenses', fmt(view.personalExpenses)],
  ];
  return (
    <article className={`card scenario tone-${tone}`}>
      <h3>{scenario.name}</h3>
      <p className="scenario-rate">
        <span className="accent">{r.hourlyRate === null ? '—' : fmt(r.hourlyRate, money.rateDecimals)}</span>
        {r.hourlyRate !== null && <small>/hr</small>}
      </p>
      {view.billablePct > BILLABLE_WARNING_THRESHOLD && (
        <p className="scenario-flag">Billable share is above 75%.</p>
      )}
      <dl className="scenario-rows">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="actions actions-row">
        <button type="button" className="btn btn-small" onClick={onLoad}>
          Load
        </button>
        <button type="button" className="btn btn-small btn-quiet" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

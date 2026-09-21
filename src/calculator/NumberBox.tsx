import { useState } from 'react';
import { clamp, round2 } from './format';

interface NumberBoxProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

/** Numeric input with a unit label. Keeps what the user is typing until they leave the field. */
export function NumberBox({
  id,
  value,
  onChange,
  ariaLabel,
  min = 0,
  max = 1_000_000_000,
  step = 1,
  prefix,
  suffix,
}: NumberBoxProps) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className="num">
      {prefix && <span className="affix">{prefix}</span>}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={draft ?? String(round2(value))}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = parseFloat(e.target.value);
          if (Number.isFinite(n)) onChange(clamp(n, min, max));
        }}
        onBlur={() => setDraft(null)}
      />
      {suffix && <span className="affix">{suffix}</span>}
    </div>
  );
}

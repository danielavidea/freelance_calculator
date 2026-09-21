import type { ReactNode } from 'react';
import { clamp } from './format';
import { NumberBox } from './NumberBox';

interface FieldProps {
  id: string;
  label: string;
  help: string;
  value: number;
  onChange: (value: number) => void;
  /** slider range */
  min: number;
  max: number;
  step: number;
  /** the number field may go beyond the slider, up to these limits */
  hardMax?: number;
  prefix?: string;
  suffix?: string;
  valueText?: string;
  /** background color of the tile */
  tone: string;
  children?: ReactNode;
}

/** One calculator input: a slider and a numeric field bound to the same value. */
export function Field({
  id,
  label,
  help,
  value,
  onChange,
  min,
  max,
  step,
  hardMax,
  prefix,
  suffix,
  valueText,
  tone,
  children,
}: FieldProps) {
  return (
    <div className={`field tone-${tone}`}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <p className="help">{help}</p>
      <div className="field-controls">
        <input
          type="range"
          aria-label={`${label} slider`}
          aria-valuetext={valueText}
          min={min}
          max={max}
          step={step}
          value={clamp(value, min, max)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <NumberBox
          id={id}
          value={value}
          onChange={onChange}
          min={min}
          max={hardMax ?? max}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
      {children}
    </div>
  );
}

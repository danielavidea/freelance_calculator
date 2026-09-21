import type { RateInputs } from './data';

export interface RateResult {
  workingWeeks: number;
  weeklyBillableHours: number;
  annualBillableHours: number;
  annualCost: number;
  targetIncome: number;
  grossIncome: number;
  monthlyRevenue: number;
  /** null when there are no billable hours to divide by */
  hourlyRate: number | null;
  dailyRate: number | null;
}

/** Inputs and outputs share one currency; the math does not care which. */
export function calcRate(i: RateInputs): RateResult {
  const workingWeeks = Math.max(0, 52 - i.vacationWeeks);
  const weeklyBillableHours = (i.weeklyHours * i.billablePct) / 100;
  const annualBillableHours = weeklyBillableHours * workingWeeks;
  const annualCost = (i.fixedCosts + i.personalExpenses) * 12;
  const targetIncome = annualCost * (1 + i.profitMargin / 100);
  // Tax can never reach 100%; the input fields already cap it well below that.
  const grossIncome = targetIncome / (1 - Math.min(i.taxPct, 99) / 100);
  const hourlyRate = annualBillableHours > 0 ? grossIncome / annualBillableHours : null;

  return {
    workingWeeks,
    weeklyBillableHours,
    annualBillableHours,
    annualCost,
    targetIncome,
    grossIncome,
    monthlyRevenue: grossIncome / 12,
    hourlyRate,
    dailyRate: hourlyRate === null ? null : hourlyRate * 8,
  };
}

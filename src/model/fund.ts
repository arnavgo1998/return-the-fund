/** Part two: a fund's own maths, in $M. One illustrative $100M fund with a 10-year life. */
export const FUND = 100;
export const YEARS = 10;
export const GP_COMMIT = 0.01;
export const CARRY = 0.2;

/** Clears float dust from sums that are exact on paper, like 0.15 × 100. */
const clean = (x: number) => Math.round(x * 1e9) / 1e9;

/** With no fees or carry, what comes back is split by what went in. */
export function splitByCommitment(R: number): { lp: number; gp: number } {
  return { lp: clean(R * (1 - GP_COMMIT)), gp: clean(R * GP_COMMIT) };
}

/** The management fee, charged on the whole fund every year, and what is left to invest. */
export function feeBudget(feeRate: number, fund = FUND, years = YEARS): { fees: number; invested: number } {
  const fees = clean(fund * feeRate * years);
  return { fees, invested: clean(fund - fees) };
}

/** LPs get the fund back first; the GP keeps `carry` of any profit above that. */
export function carrySplit(R: number, fund = FUND, carry = CARRY): { profit: number; carry: number; lp: number } {
  const profit = Math.max(clean(R - fund), 0);
  const c = clean(profit * carry);
  return { profit, carry: c, lp: clean(R - c) };
}

/** What the investments must return for LPs to get `netMultiple` × their money after carry. */
export function returnNeeded(netMultiple: number, fund = FUND, carry = CARRY): number {
  return clean(fund + (fund * netMultiple - fund) / (1 - carry));
}

/** Years 1–10: money called from LPs, cash sent back, and the paper value of what is still held. */
export const CALLS = [20, 20, 20, 20, 20, 0, 0, 0, 0, 0];
export const DISTRIBUTIONS = [0, 0, 0, 0, 0, 15, 30, 60, 90, 105];
export const NAV = [18, 42, 72, 110, 160, 190, 220, 190, 110, 0];

const upTo = (xs: number[], year: number) => xs.slice(0, year).reduce((s, x) => s + x, 0);

/** Where the illustrative fund stands at the end of `year`: cash in, cash out, and both scores. */
export function fundYear(year: number): { paidIn: number; back: number; net: number; dpi: number; tvpi: number } {
  const paidIn = upTo(CALLS, year);
  const back = upTo(DISTRIBUTIONS, year);
  const nav = NAV[year - 1] ?? 0;
  return {
    paidIn, back, net: back - paidIn,
    dpi: paidIn > 0 ? clean(back / paidIn) : 0,
    tvpi: paidIn > 0 ? clean((back + nav) / paidIn) : 0,
  };
}

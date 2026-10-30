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

/** The fee each year. With `stepDown`, it drops to 1% a year once the investing years (1–5) are over. */
export function feeSchedule(feeRate: number, stepDown = false, fund = FUND, years = YEARS): number[] {
  return Array.from({ length: years }, (_, i) => clean(fund * (stepDown && i >= 5 ? 0.01 : feeRate)));
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

/** Years 1–10: what LPs are asked for (investing money plus that year's fee), cash sent back, and the paper value still held. */
export const INVESTED_CALLS = [16, 16, 16, 16, 16, 0, 0, 0, 0, 0];
export const FEE_CALLS = feeSchedule(0.02);
export const CALLS = INVESTED_CALLS.map((c, i) => c + FEE_CALLS[i]);
export const DISTRIBUTIONS = [0, 0, 0, 0, 0, 15, 30, 60, 90, 105];
export const NAV = [16, 34, 60, 96, 150, 180, 210, 190, 110, 0];

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

/** One early sale: a company that cost $10M sells for $150M, and carry is paid on it straight away. */
export const EARLY_SALE = 150;
export const EARLY_COST = 10;

/** Carry taken deal by deal on the early sale, against what the whole fund owes once the rest returns `rest`. */
export function clawback(rest: number, fund = FUND, carry = CARRY): { R: number; taken: number; owed: number; giveBack: number; stillDue: number } {
  const R = EARLY_SALE + rest;
  const taken = clean(carry * (EARLY_SALE - EARLY_COST));
  const owed = clean(carry * Math.max(R - fund, 0));
  return { R, taken, owed, giveBack: Math.max(clean(taken - owed), 0), stillDue: Math.max(clean(owed - taken), 0) };
}

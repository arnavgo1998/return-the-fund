const trim = (n: number, digits: number) => String(Number(n.toFixed(digits)));

/** The number formatMoney prints, so later sums can be built from what the reader sees. */
export function roundMoney(m: number): number {
  if (!Number.isFinite(m) || m === 0) return m;
  if (m >= 1000) return Number(trim(m / 1000, 2)) * 1000;
  if (m >= 100) return Math.round(m);
  return Number(trim(m, m >= 10 ? 1 : 2));
}

/** $M in, plain words out: "$0.38M", "$28.8M", "$120M", "$1.25B". */
export function formatMoney(m: number): string {
  if (!Number.isFinite(m)) return "—";
  if (m === 0) return "$0";
  if (m >= 1000) return `$${trim(m / 1000, 2)}B`;
  if (m >= 100) return `$${Math.round(m)}M`;
  if (m >= 10) return `$${trim(m, 1)}M`;
  return `$${trim(m, 2)}M`;
}

/** Enough precision that the sums shown with it can be checked by hand: "0.17%", "6.67%", "12.5%". */
export function formatShare(x: number): string {
  const pct = x * 100;
  if (pct === 0) return "0%";
  if (pct < 1) return `${Number(pct.toPrecision(2))}%`;
  return `${trim(pct, pct < 10 ? 2 : 1)}%`;
}

/** "1.38×", "3×": two decimals at most, so a multiple can be checked against the sum beside it. */
export function formatMultiple(x: number): string {
  return `${trim(x, 2)}×`;
}

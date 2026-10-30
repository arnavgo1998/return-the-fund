const trim = (n: number, digits: number) => String(Number(n.toFixed(digits)));

/** $M in, plain words out: "$0.38M", "$28.8M", "$120M", "$1.25B". */
export function formatMoney(m: number): string {
  if (!Number.isFinite(m)) return "—";
  if (m === 0) return "$0";
  if (m >= 1000) return `$${trim(m / 1000, 2)}B`;
  if (m >= 100) return `$${Math.round(m)}M`;
  if (m >= 10) return `$${trim(m, 1)}M`;
  return `$${trim(m, 2)}M`;
}

export function formatShare(x: number): string {
  return `${trim(x * 100, 1)}%`;
}

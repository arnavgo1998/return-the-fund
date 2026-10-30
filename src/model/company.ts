export type HolderId = "founders" | "you" | "a" | "b";

/** Shares are squares; invested and price are in $M. */
export interface Holder { id: HolderId; shares: number; invested: number; preferred: boolean }
export interface Round { investor: HolderId; shares: number; price: number }

export const ROUND_A: Round = { investor: "a", shares: 25, price: 0.2 };
export const ROUND_B: Round = { investor: "b", shares: 25, price: 0.8 };

/** A 100-square company: you buy `cheque / price` squares, the founders keep the rest. */
export function seed(price = 0.1, cheque = 1): Holder[] {
  const yours = cheque / price;
  return [
    { id: "founders", shares: 100 - yours, invested: 0, preferred: false },
    { id: "you", shares: yours, invested: cheque, preferred: true },
  ];
}

export function applyRound(holders: Holder[], r: Round): Holder[] {
  return [...holders, { id: r.investor, shares: r.shares, invested: r.shares * r.price, preferred: true }];
}

export function capTable(stage: "seed" | "a" | "b", seedPrice = 0.1, bPrice = ROUND_B.price): Holder[] {
  const s = seed(seedPrice);
  if (stage === "seed") return s;
  const a = applyRound(s, ROUND_A);
  return stage === "a" ? a : applyRound(a, { ...ROUND_B, price: bPrice });
}

export const totalShares = (h: Holder[]) => h.reduce((sum, x) => sum + x.shares, 0);

export function shareOf(h: Holder[], id: HolderId): number {
  return (h.find((x) => x.id === id)?.shares ?? 0) / totalShares(h);
}

/** What the whole company is worth at this round's price, before and after the new money. */
export const preMoney = (h: Holder[], r: Round) => totalShares(h) * r.price;
export const postMoney = (h: Holder[], r: Round) => (totalShares(h) + r.shares) * r.price;

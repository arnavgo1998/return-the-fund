/** What the nine non-winners return, in blocks ($1M each): five fail, two give the money back, two triple it. */
export const OTHERS: number[] = [0, 0, 0, 0, 0, 1, 1, 3, 3];

const othersTotal = OTHERS.reduce((s, x) => s + x, 0);

export const fundReturn = (winner: number) => othersTotal + winner;

/** Blocks the winner must return for the fund to come back `targetMultiple` times. */
export const winnerNeeded = (targetMultiple: number, fund = 10) => fund * targetMultiple - othersTotal;

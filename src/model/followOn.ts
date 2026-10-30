export const sharesFor = (cheque: number, price: number) => cheque / price;

/**
 * The hit rate on a fresh bet at which both choices give the same squares, on average.
 * A follow-on buys cheque/roundPrice squares that pay with chance `survival`;
 * a fresh bet buys cheque/seedPrice squares that pay with chance h.
 */
export const followOnCrossover = (seedPrice: number, roundPrice: number, survival = 1) =>
  (survival * seedPrice) / roundPrice;

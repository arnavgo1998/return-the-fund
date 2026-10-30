/** The sale a company needs so that your share of it pays back the whole fund. */
export function exitNeeded(fund: number, share: number): number {
  return share > 0 ? fund / share : Infinity;
}

/** Your share after later rounds, each selling `d` of the company to someone new. */
export function shareAtEnd(cheque: number, postMoney: number, dilutions: number[]): number {
  return dilutions.reduce((share, d) => share * (1 - d), cheque / postMoney);
}

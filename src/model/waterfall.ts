import type { Holder, HolderId } from "./company";

export interface Payout { paid: Record<HolderId, number>; switched: HolderId[] }

/**
 * Splits a sale. Holders with a preference take the larger of their money back (1×)
 * or their share; they stand equal in line, and nobody gets both.
 */
export function waterfall(exit: number, holders: Holder[], preferredIds?: HolderId[]): Payout {
  const hasPref = (h: Holder) => (preferredIds ? preferredIds.includes(h.id) : h.preferred);
  const pref = holders.filter(hasPref);
  const switched = new Set<HolderId>();
  const waiting = () => pref.filter((h) => !switched.has(h.id));
  const sharingShares = () =>
    holders.filter((h) => !hasPref(h) || switched.has(h.id)).reduce((s, h) => s + h.shares, 0);

  // Cheapest squares switch first; after each switch, everyone else looks again.
  let looking = true;
  while (looking) {
    looking = false;
    for (const c of waiting().sort((x, y) => x.invested / x.shares - y.invested / y.shares)) {
      const ahead = waiting().reduce((s, h) => s + h.invested, 0) - c.invested;
      const perShare = Math.max(exit - ahead, 0) / (sharingShares() + c.shares);
      if (perShare * c.shares > c.invested) {
        switched.add(c.id);
        looking = true;
        break;
      }
    }
  }

  const paid = Object.fromEntries(holders.map((h) => [h.id, 0])) as Record<HolderId, number>;
  const owed = waiting().reduce((s, h) => s + h.invested, 0);
  if (exit < owed) {
    for (const h of waiting()) paid[h.id] = (exit * h.invested) / owed;
    return { paid, switched: [...switched] };
  }
  for (const h of waiting()) paid[h.id] = h.invested;
  const perShare = (exit - owed) / sharingShares();
  for (const h of holders) if (!hasPref(h) || switched.has(h.id)) paid[h.id] = perShare * h.shares;
  return { paid, switched: [...switched] };
}

/** The smallest sale at which `id` takes its share rather than its money back. */
export function switchPoint(holders: Holder[], id: HolderId, preferredIds?: HolderId[]): number {
  let lo = 0, hi = 10_000;
  while (hi - lo > 1e-6) {
    const mid = (lo + hi) / 2;
    if (waterfall(mid, holders, preferredIds).switched.includes(id)) hi = mid;
    else lo = mid;
  }
  return hi;
}

import { HouseResult } from './types';

export type Component = 'valuation' | 'allocation' | 'auction' | 'outcome';

export const COMPONENTS: { key: Component; label: string; max: number }[] = [
  { key: 'valuation', label: 'Valuation', max: 40 },
  { key: 'allocation', label: 'Allocation Discipline', max: 25 },
  { key: 'auction', label: 'Auction Discipline', max: 15 },
  { key: 'outcome', label: 'Outcome', max: 20 },
];

export function formatMoney(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('en-US');
}

// One plain sentence naming the player's actual numbers for a component of one house.
export function explain(key: Component, r: HouseResult): string {
  const { house, playerOffer, score } = r;
  const name = house.name;
  if (key === 'valuation') {
    const err = (Math.abs(playerOffer.estimate - house.actualAppraisal) / house.actualAppraisal) * 100;
    return `At ${name}, your estimate was ${formatMoney(playerOffer.estimate)} against an appraisal of ${formatMoney(house.actualAppraisal)}, an error of ${err.toFixed(1)} percent.`;
  }
  if (key === 'allocation') {
    const safe = house.pot - house.reserveFloor;
    if (playerOffer.allocation > safe) {
      return `At ${name}, you set aside ${formatMoney(playerOffer.allocation)} for the gap, which is ${formatMoney(playerOffer.allocation - safe)} past the ${formatMoney(safe)} that keeps your reserve intact.`;
    }
    return `At ${name}, you set aside ${formatMoney(playerOffer.allocation)} for the gap, within the ${formatMoney(safe)} that keeps your reserve intact.`;
  }
  if (key === 'auction') {
    if (r.raises === 0) return `At ${name}, you held the number you set from the evidence and never raised it.`;
    return `At ${name}, you raised your cap ${r.raises} time${r.raises === 1 ? '' : 's'}, from ${formatMoney(playerOffer.estimate + playerOffer.allocation)} to ${formatMoney(playerOffer.cap)}.`;
  }
  if (!r.won) {
    return score.outcome >= 20
      ? `At ${name}, you held your cap and let the house go, which was the right call at those prices.`
      : `At ${name}, you let the house go, so you did not get the home.`;
  }
  const s = r.settlement;
  if (!s || !s.canClose) return `At ${name}, you won at ${formatMoney(r.winningPrice ?? 0)} but the gap of ${s ? formatMoney(s.gapDue) : '$0'} was more than your spare cash, so the purchase could not close.`;
  if (!s.closesSafely) return `At ${name}, you won at ${formatMoney(r.winningPrice ?? 0)} and closed, but the gap of ${formatMoney(s.gapDue)} left ${formatMoney(s.potLeft)} against a ${formatMoney(house.reserveFloor)} reserve.`;
  return `At ${name}, you won at ${formatMoney(r.winningPrice ?? 0)} and closed with your reserve intact.`;
}

export function shortResult(r: HouseResult): string {
  if (!r.won) return 'Let it go';
  if (!r.settlement || !r.settlement.canClose) return 'Won, could not close';
  return r.settlement.closesSafely ? 'Bought, reserve safe' : 'Bought, reserve broken';
}

import type { HouseResult } from './types';
import { formatMoney } from './logic';

export type Component = 'valuation' | 'allocation' | 'auction' | 'outcome';

export const COMPONENTS: { key: Component; label: string; max: number }[] = [
  { key: 'valuation', label: 'Valuation', max: 40 },
  { key: 'allocation', label: 'Allocation Discipline', max: 25 },
  { key: 'auction', label: 'Auction Discipline', max: 15 },
  { key: 'outcome', label: 'Outcome', max: 20 },
];

export type OutcomeTone = 'safe' | 'wise' | 'warning' | 'danger';

export interface Lesson {
  key: Component;
  houseId: number;
  text: string;
}

export function outcomeLabel(result: HouseResult): string {
  if (!result.won) return result.score.outcome === 20 ? 'Walked away wisely' : 'Walked away';
  if (!result.settlement || !result.settlement.canClose) return 'Won, but could not close';
  return result.settlement.closesSafely ? 'Bought safely' : 'Bought, cushion at risk';
}

export function outcomeTone(result: HouseResult): OutcomeTone {
  if (!result.won) return result.score.outcome === 20 ? 'wise' : 'warning';
  if (!result.settlement || !result.settlement.canClose) return 'danger';
  return result.settlement.closesSafely ? 'safe' : 'warning';
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
      return `At ${name}, you were willing to bid ${formatMoney(playerOffer.allocation)} above your guess, which is ${formatMoney(playerOffer.allocation - safe)} more than the ${formatMoney(safe)} you could cover while keeping the emergency cushion intact.`;
    }
    return `At ${name}, you were willing to bid ${formatMoney(playerOffer.allocation)} above your guess, within the ${formatMoney(safe)} you could cover while keeping the emergency cushion intact.`;
  }
  if (key === 'auction') {
    if (r.raises === 0) return `At ${name}, you held the number you set from the evidence and never raised it.`;
    const safeGap = house.pot - house.reserveFloor;
    const finalGap = playerOffer.cap - playerOffer.estimate;
    const cashContext = finalGap <= safeGap
      ? 'Your final limit still protected the emergency cushion, but'
      : 'Your final limit also put the emergency cushion at risk, and';
    return `At ${name}, you raised your cap ${r.raises} time${r.raises === 1 ? '' : 's'}, from ${formatMoney(playerOffer.estimate + playerOffer.allocation)} to ${formatMoney(playerOffer.cap)}. ${cashContext} no new property evidence arrived. Auction Discipline measures whether you kept the pre-bidding rule.`;
  }
  if (!r.won) {
    return score.outcome >= 20
      ? `At ${name}, you held your cap and let the house go, which was the right call at those prices.`
      : `At ${name}, you let the house go, so you did not get the home.`;
  }
  const s = r.settlement;
  if (!s || !s.canClose) return `At ${name}, you won at ${formatMoney(r.winningPrice ?? 0)} but the gap of ${s ? formatMoney(s.gapDue) : '$0'} was more than your spare cash, so the purchase could not close.`;
  if (!s.closesSafely) return `At ${name}, you won at ${formatMoney(r.winningPrice ?? 0)} and closed, but the gap of ${formatMoney(s.gapDue)} left ${formatMoney(s.potLeft)} against a ${formatMoney(house.reserveFloor)} emergency cushion target.`;
  return `At ${name}, you won at ${formatMoney(r.winningPrice ?? 0)} and closed with your emergency cushion intact.`;
}

export function lessonsForResults(results: HouseResult[]): Lesson[] {
  const instances = results.flatMap((result, houseIndex) =>
    COMPONENTS.map((component, componentIndex) => ({
      result,
      component,
      houseIndex,
      componentIndex,
      lost: component.max - result.score[component.key],
    }))
  );
  const selected: typeof instances = [];
  const usedKeys = new Set<Component>();
  const usedHouses = new Set<number>();

  const mistakes = [...instances]
    .filter(({ lost }) => lost > 0)
    .sort((a, b) => b.lost - a.lost || a.componentIndex - b.componentIndex || a.houseIndex - b.houseIndex);

  const successOrder: Component[] = ['outcome', 'auction', 'allocation', 'valuation'];
  const successes = [...instances]
    .filter(({ lost }) => lost === 0)
    .sort((a, b) => {
      const aWiseWalkAway = !a.result.won && a.component.key === 'outcome' ? -1 : 0;
      const bWiseWalkAway = !b.result.won && b.component.key === 'outcome' ? -1 : 0;
      return aWiseWalkAway - bWiseWalkAway
        || successOrder.indexOf(a.component.key) - successOrder.indexOf(b.component.key)
        || a.houseIndex - b.houseIndex;
    });

  for (const candidate of [...mistakes, ...successes]) {
    if (usedKeys.has(candidate.component.key) || usedHouses.has(candidate.result.house.id)) continue;
    selected.push(candidate);
    usedKeys.add(candidate.component.key);
    usedHouses.add(candidate.result.house.id);
    if (selected.length === 3) break;
  }

  return selected.map(({ component, result }) => ({
    key: component.key,
    houseId: result.house.id,
    text: explain(component.key, result),
  }));
}

export function headroomPercent(cap: number, estimate: number, highestRivalBid: number | null): number {
  if (cap <= estimate) return 0;
  if (highestRivalBid === null || highestRivalBid <= estimate) return 100;
  if (highestRivalBid >= cap) return 0;
  return ((cap - highestRivalBid) / (cap - estimate)) * 100;
}

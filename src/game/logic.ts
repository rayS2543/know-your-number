import { House, Settlement, HouseScore } from './types';

export function winningPrice(finalCap: number, highestRivalBid: number, escalationStep: number): number | null {
  if (finalCap <= highestRivalBid) {
    return null;
  }
  return Math.min(finalCap, highestRivalBid + escalationStep);
}

export function settleHouse(price: number, actualAppraisal: number, pot: number, reserveFloor: number): Settlement {
  const gapDue = Math.max(0, price - actualAppraisal);
  const potLeft = pot - gapDue;
  const canClose = gapDue <= pot;
  const closesSafely = canClose && potLeft >= reserveFloor;
  return { gapDue, potLeft, canClose, closesSafely };
}

export function scoreHouse(input: {
  houseId: 1 | 2 | 3;
  estimate: number;
  actualAppraisal: number;
  allocation: number;
  pot: number;
  reserveFloor: number;
  raises: number;            // number of cap raise events, 0 or more
  won: boolean;
  canClose: boolean;         // for a loss, pass false
  closesSafely: boolean;     // for a loss, pass false
}): HouseScore {
  const { houseId, estimate, actualAppraisal, allocation, pot, reserveFloor, raises, won, canClose, closesSafely } = input;

  let valuation = 0;
  const errorPercent = Math.abs(estimate - actualAppraisal) / actualAppraisal * 100;
  if (errorPercent <= 1) {
    valuation = 40;
  } else if (errorPercent <= 2) {
    valuation = 32;
  } else if (errorPercent <= 3) {
    valuation = 24;
  } else if (errorPercent <= 5) {
    valuation = 14;
  } else {
    valuation = 6;
  }

  let allocationScore = 0;
  const safeLimit = pot - reserveFloor;
  if (allocation <= safeLimit) {
    allocationScore = 25;
  } else {
    allocationScore = Math.max(0, 25 - 5 * Math.ceil((allocation - safeLimit) / 1000));
  }

  let auctionScore = 0;
  if (raises === 0) {
    auctionScore = 15;
  } else if (raises === 1) {
    auctionScore = 5;
  } else {
    auctionScore = 0;
  }

  let outcomeScore = 0;
  if (won) {
    if (canClose && closesSafely) {
      if (houseId === 1) {
        outcomeScore = 20;
      } else if (houseId === 2) {
        outcomeScore = 4;
      } else if (houseId === 3) {
        outcomeScore = 20;
      }
    } else if (canClose) {
      if (houseId === 1) {
        outcomeScore = 8;
      } else if (houseId === 2) {
        outcomeScore = 0;
      } else if (houseId === 3) {
        outcomeScore = 10;
      }
    }
  } else {
    if (houseId === 2) {
      outcomeScore = 20;
    } else {
      outcomeScore = 6;
    }
  }

  const total = valuation + allocationScore + auctionScore + outcomeScore;

  return { valuation, allocation: allocationScore, auction: auctionScore, outcome: outcomeScore, total };
}

export function standingOffer(cap: number, highestRivalBid: number, escalationStep: number): number {
  return Math.min(cap, highestRivalBid + escalationStep);
}

export function gradeForTotal(total: number): string {
  if (total >= 270 && total <= 300) {
    return "You buy with a number, not a feeling.";
  } else if (total >= 210 && total <= 269) {
    return "Solid instincts, one leak to fix.";
  } else if (total >= 120 && total <= 209) {
    return "The market moved you more than the evidence did.";
  } else {
    return "You were bidding to win, not to buy well.";
  }
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

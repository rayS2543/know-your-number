export interface Comp {
  price: number;
  distanceMi: number;
  sqftNote: string;
  conditionNote: string;
  soldNote: string;
}

export interface House {
  id: number;
  name: string;
  listingPrice: number;
  beds: number;
  sqft: number;
  blurb: string;
  pot: number;
  reserveFloor: number;
  escalationStep: number;
  comps: Comp[];
  actualAppraisal: number;
  appraisalDerivation: string;
  rivalBids: number[];
  rivalNote: string;
}

export interface PlayerOffer {
  price: number;
}

export interface HouseResult {
  house: House;
  playerOffer: PlayerOffer;
  settlement: Settlement;
  score: HouseScore;
}

export interface GameState {
  currentHouseIndex: number;
  houses: House[];
  playerOffers: PlayerOffer[];
  houseResults: HouseResult[];
}

export interface Settlement {
  gapDue: number;        // max(0, price - actualAppraisal)
  potLeft: number;       // pot - gapDue
  canClose: boolean;     // gapDue <= pot
  closesSafely: boolean; // canClose && potLeft >= reserveFloor
}

export interface HouseScore {
  valuation: number;   // 0 to 40
  allocation: number;  // 0 to 25
  auction: number;     // 0 to 15
  outcome: number;     // 0 to 20
  total: number;       // sum, 0 to 100
}

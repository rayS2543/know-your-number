import { House, Comp } from './types';

export const houses: House[] = [
  {
    id: 1,
    name: "Maple Street Craftsman",
    listingPrice: 385000,
    beds: 3,
    sqft: 1480,
    blurb: "A tidy craftsman on a quiet street, priced under the neighbours to draw offers.",
    pot: 20000,
    reserveFloor: 8000,
    escalationStep: 3000,
    comps: [
      { price: 396000, distanceMi: 0.3, sqftNote: "similar sq ft", conditionNote: "similar condition", soldNote: "sold last month" },
      { price: 404000, distanceMi: 0.4, sqftNote: "similar sq ft", conditionNote: "similar condition", soldNote: "sold 2 months ago" },
      { price: 428000, distanceMi: 0.6, sqftNote: "500 sq ft larger", conditionNote: "fully renovated kitchen", soldNote: "sold last month" }
    ],
    actualAppraisal: 400000,
    appraisalDerivation: "The two most similar sales, $396,000 and $404,000, average to $400,000. The $428,000 sale is 500 sq ft larger with a renovated kitchen, so an appraiser weights it lightly.",
    rivalBids: [388000, 394000, 400000, 405000, 408000],
    rivalNote: "The top rival is another first time buyer couple who stopped at $408,000."
  },
  {
    id: 2,
    name: "Hillside View House",
    listingPrice: 499000,
    beds: 4,
    sqft: 2050,
    blurb: "A view lot above the hills. The photos are beautiful and everyone at the open house knew it.",
    pot: 20000,
    reserveFloor: 8000,
    escalationStep: 3000,
    comps: [
      { price: 498000, distanceMi: 0.2, sqftNote: "similar sq ft and condition", soldNote: "sold last month" },
      { price: 506000, distanceMi: 0.5, sqftNote: "similar sq ft and condition", soldNote: "sold last month" },
      { price: 505000, distanceMi: 0.3, sqftNote: "similar sq ft and condition", soldNote: "sold 3 weeks ago" }
    ],
    actualAppraisal: 503000,
    appraisalDerivation: "All three sales are close, recent, and similar, so they carry near equal weight: ($498,000 + $506,000 + $505,000) / 3 = $503,000.",
    rivalBids: [505000, 518000, 530000, 541000, 552000],
    rivalNote: "The top rival fell in love with the view and bid $552,000. Against a $503,000 appraisal, that is a $49,000 gap they had to cover in cash."
  },
  {
    id: 3,
    name: "Elm Street Ranch",
    listingPrice: 359000,
    beds: 3,
    sqft: 1350,
    blurb: "A ranch with a renovated kitchen and everything else original. Harder to price than it looks.",
    pot: 16000,
    reserveFloor: 6000,
    escalationStep: 2000,
    comps: [
      { price: 355000, distanceMi: 0.4, sqftNote: "similar sq ft", conditionNote: "original condition", soldNote: "sold last month" },
      { price: 375000, distanceMi: 0.8, sqftNote: "similar sq ft", conditionNote: "renovated kitchen", soldNote: "sold 2 months ago" },
      { price: 390000, distanceMi: 0.5, sqftNote: "larger sq ft", conditionNote: "fully renovated throughout", soldNote: "sold last month" },
      { price: 338000, distanceMi: 0.3, sqftNote: "300 sq ft smaller", conditionNote: "original condition", soldNote: "sold 3 months ago" }
    ],
    actualAppraisal: 365000,
    appraisalDerivation: "The two most similar sales are the original condition house at $355,000 and the renovated kitchen house at $375,000, which average to $365,000. The larger fully renovated sale and the smaller sale are weighted lightly.",
    rivalBids: [358000, 364000, 369000, 372000],
    rivalNote: "The top rival is an investor who stopped at $372,000."
  }
];

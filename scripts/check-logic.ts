// Oracle for Know Your Number. Copy into the repo at scripts/check-logic.ts at Task 2 time.
// Run with a TS runner, for example: npx tsx scripts/check-logic.ts
// Every expected value below comes from PLAN.md sections 4 and 5. Never edit an
// expected value to make a failing run pass. If an assertion fails, the logic is wrong.
// If logic.ts uses different export names, adjust ONLY the imports below and report it.

import { winningPrice, settleHouse, scoreHouse, standingOffer } from "../src/game/logic";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`PASS ${label}: ${a}`);
  } else {
    failures += 1;
    console.log(`FAIL ${label}: expected ${e}, got ${a}`);
  }
}

// standingOffer
check("standingOffer H1 final", standingOffer(412000, 408000, 3000), 411000);
check("standingOffer capped", standingOffer(410000, 408000, 3000), 410000);

// winningPrice
check("winningPrice H1 ideal", winningPrice(412000, 408000, 3000), 411000);
check("winningPrice H1 low cap wins at cap", winningPrice(409000, 408000, 3000), 409000);
check("winningPrice tie loses", winningPrice(408000, 408000, 3000), null);
check("winningPrice under loses", winningPrice(400000, 408000, 3000), null);
check("winningPrice H2 chase", winningPrice(558000, 552000, 3000), 555000);
check("winningPrice H3 ideal", winningPrice(375000, 372000, 2000), 374000);

// settleHouse
check("settle H1 ideal", settleHouse(411000, 400000, 20000, 8000), {
  gapDue: 11000, potLeft: 9000, canClose: true, closesSafely: true,
});
check("settle H3 ideal", settleHouse(374000, 365000, 16000, 6000), {
  gapDue: 9000, potLeft: 7000, canClose: true, closesSafely: true,
});
check("settle H2 chase cannot close", settleHouse(555000, 503000, 20000, 8000), {
  gapDue: 52000, potLeft: -32000, canClose: false, closesSafely: false,
});
check("settle under appraisal", settleHouse(395000, 400000, 20000, 8000), {
  gapDue: 0, potLeft: 20000, canClose: true, closesSafely: true,
});

// scoreHouse: perfect run, 100 per house, 300 total
const h1Perfect = scoreHouse({
  houseId: 1, estimate: 400000, actualAppraisal: 400000, allocation: 12000,
  pot: 20000, reserveFloor: 8000, raises: 0, won: true, canClose: true, closesSafely: true,
});
check("score H1 perfect", h1Perfect, { valuation: 40, allocation: 25, auction: 15, outcome: 20, total: 100 });

const h2Perfect = scoreHouse({
  houseId: 2, estimate: 503000, actualAppraisal: 503000, allocation: 12000,
  pot: 20000, reserveFloor: 8000, raises: 0, won: false, canClose: false, closesSafely: false,
});
check("score H2 perfect (correct loss)", h2Perfect, { valuation: 40, allocation: 25, auction: 15, outcome: 20, total: 100 });

const h3Perfect = scoreHouse({
  houseId: 3, estimate: 365000, actualAppraisal: 365000, allocation: 10000,
  pot: 16000, reserveFloor: 6000, raises: 0, won: true, canClose: true, closesSafely: true,
});
check("score H3 perfect", h3Perfect, { valuation: 40, allocation: 25, auction: 15, outcome: 20, total: 100 });
check("perfect run total", h1Perfect.total + h2Perfect.total + h3Perfect.total, 300);

// scoreHouse: failure and discipline cases
const h2Chase = scoreHouse({
  houseId: 2, estimate: 503000, actualAppraisal: 503000, allocation: 12000,
  pot: 20000, reserveFloor: 8000, raises: 1, won: true, canClose: false, closesSafely: false,
});
check("score H2 chase outcome is 0", h2Chase.outcome, 0);
check("score H2 chase auction is 5", h2Chase.auction, 5);

const h1FatAllocation = scoreHouse({
  houseId: 1, estimate: 400000, actualAppraisal: 400000, allocation: 15000,
  pot: 20000, reserveFloor: 8000, raises: 0, won: true, canClose: true, closesSafely: true,
});
// $3,000 over the $12,000 safe limit = 3 steps x 5 points = 15 lost
check("score H1 allocation 15000", h1FatAllocation.allocation, 10);

const h1BadEstimate = scoreHouse({
  houseId: 1, estimate: 385000, actualAppraisal: 400000, allocation: 12000,
  pot: 20000, reserveFloor: 8000, raises: 0, won: false, canClose: false, closesSafely: false,
});
// Error is 3.75 percent, so valuation is 14. Loss on House 1 is 6.
check("score H1 list price estimate valuation", h1BadEstimate.valuation, 14);
check("score H1 loss outcome", h1BadEstimate.outcome, 6);

const twoRaises = scoreHouse({
  houseId: 3, estimate: 365000, actualAppraisal: 365000, allocation: 10000,
  pot: 16000, reserveFloor: 6000, raises: 2, won: true, canClose: true, closesSafely: true,
});
check("score two raises auction is 0", twoRaises.auction, 0);

console.log(failures === 0 ? "ORACLE: ALL CHECKS PASSED" : `ORACLE: ${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);

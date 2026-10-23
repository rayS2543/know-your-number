# Conventions for Know Your Number
# Aider: load this file as read only context on every run. These rules outrank anything in a single task message if the two ever conflict.

## The project

Know Your Number is a small educational game built with Vite, React, TypeScript, and Tailwind CSS. No backend, no database, no auth, no external APIs, no routing library, no state library, no Phaser. All state lives in the browser in a single useReducer game hook.

## The one concept the game teaches

A buyer's maximum offer is estimated appraised value plus the gap cash they can safely spend. The lender lends against the appraised value, not the offer. Any part of the price above the appraisal is cash the buyer pays themselves. Down payment and closing costs are already set aside and are never part of this game's maths.

## Rules that never change

1. No randomness anywhere. No Math.random, no shuffling, no date or time based game logic. All three houses are authored data with fixed numbers.
2. Never change a number, name, rule, or piece of copy given in a task. If something looks wrong, build it as written and add the concern to BLOCKED.md.
3. No extra features, screens, houses, mechanics, or libraries beyond the tasks.
4. Pure game logic lives in src/game/logic.ts with no React imports. Components must call the logic functions instead of reimplementing maths.
5. Write complete files when creating or changing a file. Prefer obvious code over clever code. A person must be able to explain every function out loud.
6. No slang and no em dashes in code, comments, copy, or commit messages.
7. After each task, run npm run build and fix errors until it passes. Then commit with the exact message the task gives you.

## Locked logic API (src/game/logic.ts must export exactly these)

```ts
export interface Settlement {
  gapDue: number;        // max(0, price - actualAppraisal)
  potLeft: number;       // pot - gapDue
  canClose: boolean;     // gapDue <= pot
  closesSafely: boolean; // canClose && potLeft >= reserveFloor
}

export function winningPrice(finalCap: number, highestRivalBid: number, escalationStep: number): number | null
// Returns null when finalCap <= highestRivalBid (a tie does not win).
// Otherwise returns min(finalCap, highestRivalBid + escalationStep).

export function settleHouse(price: number, actualAppraisal: number, pot: number, reserveFloor: number): Settlement

export interface HouseScore {
  valuation: number;   // 0 to 40
  allocation: number;  // 0 to 25
  auction: number;     // 0 to 15
  outcome: number;     // 0 to 20
  total: number;       // sum, 0 to 100
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
}): HouseScore
```

Scoring rules for scoreHouse:
- Valuation: errorPercent = abs(estimate - actualAppraisal) / actualAppraisal * 100. At or under 1: 40. At or under 2: 32. At or under 3: 24. At or under 5: 14. Over 5: 6.
- Allocation: safeLimit = pot - reserveFloor. Allocation at or under safeLimit: 25. Above it: minus 5 per $1,000 or part of $1,000 over, floor 0.
- Auction: raises 0: 15. Raises 1: 5. Raises 2 or more: 0.
- Outcome: apply this general rule FIRST: a win where canClose is false scores 0. Then the per house table:
  - House 1: win and canClose and closesSafely: 20. Win and canClose but not closesSafely: 8. Loss: 6.
  - House 2: loss: 20 (losing this house at a held cap is the designed correct result). Win and canClose but not closesSafely: 4. (A win that cannot close is already 0 from the general rule.)
  - House 3: win and canClose and closesSafely: 20. Win and canClose but not closesSafely: 10. Loss: 6.

Also export a helper for the live bidding readout:

```ts
export function standingOffer(cap: number, highestRivalBid: number, escalationStep: number): number
// min(cap, highestRivalBid + escalationStep)
```

And a grade helper for the final results screen:

```ts
export function gradeForTotal(total: number): string
// 270 to 300: "You buy with a number, not a feeling."
// 210 to 269: "Solid instincts, one leak to fix."
// 120 to 209: "The market moved you more than the evidence did."
// Under 120: "You were bidding to win, not to buy well."
```

## File map

- src/App.tsx - phase switching only
- src/game/types.ts - House, Comp, PlayerOffer, HouseResult, GameState types
- src/game/houses.ts - the three authored houses
- src/game/logic.ts - the locked API above, pure functions only
- src/game/useGame.ts - the useReducer game state hook
- src/components/StartScreen.tsx
- src/components/DossierScreen.tsx
- src/components/SetNumberScreen.tsx
- src/components/BiddingScreen.tsx
- src/components/RevealScreen.tsx
- src/components/FinalResultsScreen.tsx
- scripts/check-logic.ts - the oracle (added by the supervisor, not written by the model)

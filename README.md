# Know Your Number

Know Your Number is a browser game about setting a defensible home-offer limit before a bidding war makes the decision emotional.

## Game Concept

First-time buyers often assume that offering more simply means borrowing more. The missing idea is the appraisal gap: a lender bases the loan on the appraised value, and the buyer must cover any amount above that value with cash. Know Your Number turns that constraint into the game's central mechanic.

The player works through three authored property files. For each house, they study nearby comparable sales, estimate the bank appraisal, and choose how much cash they can safely put toward a possible gap while keeping an emergency cushion for moving, repairs, and surprises. Those two choices create a walk-away number. Rival offers then arrive one at a time. When bidding reaches the player's limit, they must either hold the number they set from the evidence or raise it under pressure.

The score rewards four kinds of judgment: appraisal accuracy, cash allocation, auction discipline, and the financial quality of the outcome. Auction Discipline is specifically a precommitment score: a raise can remain affordable while still changing a rule under competitive pressure. Buying every house is not the goal. One scenario is deliberately designed so that walking away is the best result.

The tension comes from watching headroom disappear as rival bids rise. The player has already written the rule; the fun is discovering whether they trust it when the room gets loud. By the end, they understand that a strong offer is not the highest number they can imagine. It is the highest number they can explain and still afford if the appraisal comes in low.

## How to Run Locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To verify a production build:

```bash
npm run build
```

## Tech Choices

- React and TypeScript for a small, explicit component model.
- `useReducer` for the complete game state and phase transitions.
- Pure functions for auction pricing, settlement, scoring, and feedback.
- Tailwind's build pipeline with a custom CSS system for the appraisal-file visual language.
- Fixed authored scenarios instead of randomness, which makes each learning outcome intentional and testable.

## How the Code Fits Together

- `houses.ts` contains the three fixed scenarios and their numbers.
- `useGame.ts` holds the game state and moves between phases with one reducer.
- `App.tsx` chooses the screen for the current phase.
- The screen components collect choices and dispatch simple actions.
- `logic.ts` handles the auction, settlement, and score as pure functions; `explain.ts` turns results into player-facing feedback.
- `index.css` contains the complete responsive visual system. There is no backend, router, or external API.

## What I Would Do With More Time

- Add automated component and end-to-end tests around the complete three-house path.
- Add optional sound and richer bid timing, both respecting reduced-motion and mute preferences.
- Test the lesson copy with first-time buyers and revise the explanations where they hesitate.

## Known Issues

- Progress is intentionally session-only and resets when the page refreshes.
- The prototype contains three fixed scenarios; it does not generate new properties or market conditions.

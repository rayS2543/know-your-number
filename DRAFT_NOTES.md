# Draft Notes

## What is built
- Start screen: title, pitch, how it works, Start button.
- Dossier: house card, comparable sales table, cash panel, progress line and running total, Set Your Number button.
- Set Your Number: estimate (starts unset), gap cash, reserve warning, live walk away number, Submit Offer.
- Bidding: bid ladder, standing offer, headroom, Next Rival Bid, cap checkpoint with Hold and Raise ($3,000 steps, gap preview), See the Appraisal.
- Reveal: result headline, appraisal and derivation, settlement or what-if line, rival note, score breakdown with explanations, player numbers, Next House or See Final Results.
- Final results: total out of 300, grade line, per house summary, three lessons, concept paragraph, Play Again.

## What is rough
- Styling: Reveal and Final results use Tailwind; Start, Dossier, Set Number and Bidding mostly use unstyled markup and need a styling pass.
- Money formatting helpers are duplicated across a few components; `src/game/explain.ts` has the shared one.
- The raise stepper is a fixed $3,000 as the task states; House 3 has a $2,000 escalation step.
- The reveal and final screens were written by the supervisor, not the local model.

## Blocked
Nothing blocked.

## Self check results
- Task 4: House 1 with estimate 400000 and allocation 12000 showed a walk away number of $412,000 and "Your reserve stays intact." (browser run).
- Task 5: House 1 cap 412000, five bids, no checkpoint, standing offer $411,000 (browser run). House 2 cap 515000: checkpoint after the second bid (518,000), Hold records a loss scoring 100 (reducer run). House 2 raise to 560,000 then play out: win at winning price $555,000 (reducer run).
- Task 6: scripted browser playthrough (H1 400000/12000, H2 503000/12000 hold, H3 365000/10000) ended at 300 / 300 and Play Again returned to the start screen.
- Oracle (`npx tsx scripts/check-logic.ts`) passes every assertion. `npm run build` (tsc plus vite) passes. No `Math.random` or `console.` in `src`.

## Numbers
Numbers verified against the task files and the oracle. Visible figures in the browser run matched PLAN.md section 4 for the three perfect-run houses; Houses 2 and 3 failure paths were checked at the reducer level only.

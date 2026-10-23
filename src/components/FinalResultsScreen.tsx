import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { gradeForTotal } from '../game/logic';
import { COMPONENTS, explain, shortResult } from '../game/explain';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const CONCEPT =
  'A lender lends against what a house appraises for, not what you offer. Anything you pay above the appraisal is cash out of your own pocket. The buyers who come out of a bidding war well are not the ones who wanted the house most. They are the ones who worked out their number from the evidence, capped it with the cash they could actually spare, and held it when the room got loud.';

const FinalResultsScreen = ({ state, dispatch }: Props) => {
  const results = state.houseResults;
  const total = results.reduce((sum, r) => sum + r.score.total, 0);

  // Every house/component pair, ordered by points lost, ties by component order then house order.
  const instances = results.flatMap((r, h) =>
    COMPONENTS.map((c, ci) => ({ r, c, h, ci, lost: c.max - r.score[c.key] }))
  );
  const byLoss = [...instances].sort((a, b) => b.lost - a.lost || a.ci - b.ci || a.h - b.h);
  const lessons = byLoss.slice(0, 3).map((i) => explain(i.c.key, i.r));
  // Fewer than three points lost anywhere means the lessons name the best decisions instead, same style.
  const bestMode = byLoss.filter((i) => i.lost > 0).length === 0;
  const lessonList = bestMode ? [...instances].sort((a, b) => a.ci - b.ci || a.h - b.h).slice(0, 3).map((i) => explain(i.c.key, i.r)) : lessons;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h2 className="text-2xl font-bold">Final Results</h2>
      <p className="text-4xl font-bold">{total} / 300</p>
      <p className="text-lg">{gradeForTotal(total)}</p>

      <div className="rounded-xl border p-4">
        {results.map((r) => (
          <div key={r.house.id} className="flex justify-between py-1">
            <span>{r.house.name}: {shortResult(r)}</span>
            <span>{r.score.total} / 100</span>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold">{bestMode ? 'Your best decisions' : 'Three lessons'}</h3>
        <ul className="list-disc pl-5">
          {lessonList.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <p>{CONCEPT}</p>

      <button className="rounded-lg bg-blue-600 px-4 py-2 text-white" onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>
        Play Again
      </button>
    </div>
  );
};

export default FinalResultsScreen;

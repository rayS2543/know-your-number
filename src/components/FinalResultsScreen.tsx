import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { gradeForTotal } from '../game/logic';
import { lessonsForResults, outcomeLabel, outcomeTone } from '../game/explain';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const CONCEPT =
  'The lender works from the appraisal, not your offer. A durable walk-away number combines evidence with the cash you can safely use for a gap. Set it before the bidding starts, then let the number make the hard decision.';

const FinalResultsScreen = ({ state, dispatch }: Props) => {
  const results = state.houseResults;
  const total = results.reduce((sum, result) => sum + result.score.total, 0);
  const lessons = lessonsForResults(results);

  return (
    <main className="screen final-screen">
      <header className="final-hero">
        <div>
          <p className="eyebrow">Final decision report</p>
          <h1>{gradeForTotal(total)}</h1>
        </div>
        <div className="final-score" aria-label={`${total} points out of 300`}>
          <strong>{total}</strong>
          <span>/ 300</span>
        </div>
      </header>

      <section aria-labelledby="decision-ledger-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Three houses, three calls</p>
            <h2 id="decision-ledger-title">Decision ledger</h2>
          </div>
        </div>
        <div className="decision-ledger">
          {results.map((result) => (
            <article className={`decision-card decision-card--${outcomeTone(result)}`} key={result.house.id}>
              <div>
                <p className="decision-card__house">{result.house.name}</p>
                <strong>{outcomeLabel(result)}</strong>
              </div>
              <span>{result.score.total} / 100</span>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-sheet" aria-labelledby="lessons-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Keep these</p>
            <h2 id="lessons-title">Three rules for the next offer</h2>
          </div>
        </div>
        <ol>
          {lessons.map((lesson, index) => (
            <li key={`${lesson.houseId}-${lesson.key}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{lesson.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <aside className="concept-note">
        <p className="eyebrow">The one idea</p>
        <p>{CONCEPT}</p>
      </aside>

      <footer className="screen-actions screen-actions--final">
        <p>A good outcome is not always a house. Sometimes it is the cash you kept.</p>
        <button onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>Play again</button>
      </footer>
    </main>
  );
};

export default FinalResultsScreen;

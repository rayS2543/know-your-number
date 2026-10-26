import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { COMPONENTS, explain, outcomeLabel, outcomeTone } from '../game/explain';
import { formatMoney } from '../game/logic';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const RevealScreen = ({ state, dispatch }: Props) => {
  const result = state.houseResults[state.currentHouseIndex];
  const { house, playerOffer, score, settlement } = result;
  const last = state.currentHouseIndex >= state.houses.length - 1;
  const soldFor = house.rivalBids[house.rivalBids.length - 1];
  const label = outcomeLabel(result);
  const tone = outcomeTone(result);

  const takeaway = !result.won
    ? score.outcome === 20
      ? `Winning would have created a ${formatMoney(soldFor - house.actualAppraisal)} appraisal gap. Walking away protected your cash.`
      : `Your limit kept you from paying past ${formatMoney(playerOffer.cap)}, but this house was designed to reward a safe purchase.`
    : !settlement || !settlement.canClose
      ? `The appraisal gap exceeded your ${formatMoney(house.pot)} cash pot, so the purchase would have fallen through.`
      : settlement.closesSafely
        ? `You covered the gap and kept ${formatMoney(settlement.potLeft)} in your emergency cushion.`
        : `You could close, but the gap pulled your cash below the ${formatMoney(house.reserveFloor)} emergency cushion.`;

  return (
    <main className="screen result-screen">
      <header className={`result-hero result-hero--${tone}`}>
        <div>
          <p className="eyebrow">House {state.currentHouseIndex + 1} decision</p>
          <h1>{label}</h1>
          <p className="result-house">{house.name}</p>
        </div>
        <div className="result-stamp" aria-label={`${score.total} points out of 100`}>
          <strong>{score.total}</strong>
          <span>/ 100</span>
        </div>
      </header>

      <section className="takeaway" aria-labelledby="takeaway-title">
        <p className="eyebrow" id="takeaway-title">What this decision means</p>
        <p>{takeaway}</p>
      </section>

      <div className="result-grid">
        <section className="appraisal-card" aria-labelledby="appraisal-title">
          <p className="eyebrow" id="appraisal-title">Bank appraisal</p>
          <p className="money-display">{formatMoney(house.actualAppraisal)}</p>
          <p>{house.appraisalDerivation}</p>
        </section>

        <section className="settlement-card" aria-labelledby="settlement-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The numbers</p>
              <h2 id="settlement-title">Settlement check</h2>
            </div>
          </div>
          {result.won && settlement ? (
            <dl className="metric-list">
              <div><dt>Winning price</dt><dd>{formatMoney(result.winningPrice ?? 0)}</dd></div>
              <div><dt>Appraisal gap</dt><dd>{formatMoney(settlement.gapDue)}</dd></div>
              <div><dt>Cash remaining</dt><dd>{formatMoney(settlement.potLeft)}</dd></div>
              <div><dt>Emergency cushion target</dt><dd>{formatMoney(house.reserveFloor)}</dd></div>
            </dl>
          ) : (
            <dl className="metric-list">
              <div><dt>Final sale</dt><dd>{formatMoney(soldFor)}</dd></div>
              <div><dt>Appraisal gap avoided</dt><dd>{formatMoney(Math.max(0, soldFor - house.actualAppraisal))}</dd></div>
              <div><dt>Your walk-away number</dt><dd>{formatMoney(playerOffer.cap)}</dd></div>
              <div><dt>Cash pot protected</dt><dd>{formatMoney(house.pot)}</dd></div>
            </dl>
          )}
          <p className="annotation">{house.rivalNote}</p>
        </section>
      </div>

      <section className="score-card" aria-labelledby="score-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Decision quality</p>
            <h2 id="score-title">Score breakdown</h2>
          </div>
          <strong>{score.total} / 100</strong>
        </div>
        <div className="score-list">
          {COMPONENTS.map((component) => {
            const value = score[component.key];
            return (
              <div className="score-row" key={component.key}>
                <div className="score-row__label">
                  <span>{component.label}</span>
                  <span>{value} / {component.max}</span>
                </div>
                <div className="score-track" aria-hidden="true">
                  <span style={{ width: `${(value / component.max) * 100}%` }} />
                </div>
                {value < component.max ? <p>{explain(component.key, result)}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="screen-actions">
        <p>
          Estimate {formatMoney(playerOffer.estimate)} · Original limit {formatMoney(playerOffer.estimate + playerOffer.allocation)}
          {result.raises > 0 ? ` · Final limit ${formatMoney(playerOffer.cap)}` : ''}
        </p>
        <button onClick={() => dispatch({ type: last ? 'SHOW_FINAL_RESULTS' : 'BEGIN_HOUSE' })}>
          {last ? 'Review all decisions' : 'Price the next house'}
        </button>
      </footer>
    </main>
  );
};

export default RevealScreen;

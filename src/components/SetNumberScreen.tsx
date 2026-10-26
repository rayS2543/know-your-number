import { useState } from 'react';
import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { formatMoney } from '../game/logic';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const SetNumberScreen = ({ state, dispatch }: Props) => {
  const currentHouse = state.houses[state.currentHouseIndex];
  const [estimate, setEstimate] = useState<number | null>(currentHouse.listingPrice);
  const [allocation, setAllocation] = useState(0);
  const safeGapAmount = currentHouse.pot - currentHouse.reserveFloor;
  const estimateMin = Math.floor((currentHouse.listingPrice * 0.8) / 1000) * 1000;
  const estimateMax = Math.ceil((currentHouse.listingPrice * 1.2) / 1000) * 1000;
  const estimateValid = estimate !== null && estimate >= estimateMin && estimate <= estimateMax && estimate % 1000 === 0;
  const walkAwayNumber = estimateValid ? estimate + allocation : null;
  const totalScore = state.houseResults.reduce((sum, result) => sum + result.score.total, 0);

  const handleEstimateChange = (value: string) => {
    const nextEstimate = Number.parseInt(value, 10);
    setEstimate(Number.isFinite(nextEstimate) && nextEstimate > 0 ? nextEstimate : null);
  };

  const handleSubmit = () => {
    if (!estimateValid) return;
    dispatch({ type: 'SUBMIT_OFFER', payload: { estimate, allocation } });
  };

  return (
    <main className="screen offer-screen">
      <header className="round-header">
        <div>
          <p className="eyebrow">Offer desk · House {state.currentHouseIndex + 1} of {state.houses.length}</p>
          <h1>{currentHouse.name}</h1>
        </div>
        {totalScore > 0 ? <p className="running-score"><span>Score</span>{totalScore}</p> : null}
      </header>

      <section className="property-brief" aria-labelledby="property-title">
        <div>
          <p className="eyebrow">Property file</p>
          <h2 id="property-title">Price the evidence, not the pressure.</h2>
          <p>{currentHouse.blurb}</p>
        </div>
        <dl className="property-facts">
          <div><dt>Asking</dt><dd>{formatMoney(currentHouse.listingPrice)}</dd></div>
          <div><dt>Beds</dt><dd>{currentHouse.beds}</dd></div>
          <div><dt>Square feet</dt><dd>{currentHouse.sqft.toLocaleString('en-US')}</dd></div>
        </dl>
      </section>

      <div className="offer-layout">
        <section className="comp-section" aria-labelledby="comps-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Appraiser's evidence</p>
              <h2 id="comps-title">Comparable sales</h2>
            </div>
            <p>Recent, nearby, and similar homes carry the most weight.</p>
          </div>

          <div className="comp-table-wrap">
            <table className="comp-table">
              <thead>
                <tr><th>Sale price</th><th>Distance</th><th>Size</th><th>Condition</th><th>Sold</th></tr>
              </thead>
              <tbody>
                {currentHouse.comps.map((comp) => (
                  <tr key={`${comp.price}-${comp.distanceMi}`}>
                    <td>{formatMoney(comp.price)}</td>
                    <td>{comp.distanceMi} mi</td>
                    <td>{comp.sqftNote}</td>
                    <td>{comp.conditionNote}</td>
                    <td>{comp.soldNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="comp-list">
            {currentHouse.comps.map((comp, index) => (
              <article key={`${comp.price}-${comp.distanceMi}`}>
                <div><span>Comp {index + 1}</span><strong>{formatMoney(comp.price)}</strong></div>
                <dl>
                  <div><dt>Distance</dt><dd>{comp.distanceMi} mi</dd></div>
                  <div><dt>Size</dt><dd>{comp.sqftNote}</dd></div>
                  <div><dt>Condition</dt><dd>{comp.conditionNote}</dd></div>
                  <div><dt>Sold</dt><dd>{comp.soldNote}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <aside className="offer-panel" aria-labelledby="offer-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your offer rule</p>
              <h2 id="offer-title">Set the number now.</h2>
            </div>
          </div>

          <section className="cash-gauge" aria-labelledby="cash-title">
            <div className="cash-gauge__header">
              <div><span id="cash-title">Cash available</span><strong>{formatMoney(currentHouse.pot)}</strong></div>
              <div><span>Emergency cushion to keep</span><strong>{formatMoney(currentHouse.reserveFloor)}</strong></div>
            </div>
            <div className="cash-gauge__track" aria-hidden="true">
              <span className="cash-gauge__safe" style={{ width: `${(safeGapAmount / currentHouse.pot) * 100}%` }} />
              <span className="cash-gauge__reserve" style={{ width: `${(currentHouse.reserveFloor / currentHouse.pot) * 100}%` }} />
              <span className="cash-gauge__allocation" style={{ width: `${(allocation / currentHouse.pot) * 100}%` }} />
            </div>
            <p>
              Keep {formatMoney(currentHouse.reserveFloor)} for moving, repairs, and surprises. That leaves {formatMoney(safeGapAmount)} for an appraisal gap.
            </p>
          </section>

          <div className="offer-control">
            <div className="control-label">
              <label id="appraisal-label" htmlFor="appraisal-input">1. Estimate the appraisal</label>
              <strong>{estimateValid ? formatMoney(estimate) : 'Enter a valid estimate'}</strong>
            </div>
            <p id="appraisal-help">Use the comparable sales. Estimates move in $1,000 steps.</p>
            <input
              id="appraisal-range"
              type="range"
              min={estimateMin}
              max={estimateMax}
              step={1000}
              value={estimate ?? currentHouse.listingPrice}
              aria-labelledby="appraisal-label"
              aria-describedby="appraisal-help"
              aria-valuetext={estimateValid ? formatMoney(estimate) : undefined}
              onChange={(event) => handleEstimateChange(event.target.value)}
            />
            <div className="number-field">
              <span>$</span>
              <input
                id="appraisal-input"
                type="number"
                min={estimateMin}
                max={estimateMax}
                step={1000}
                value={estimate ?? ''}
                aria-describedby="appraisal-help"
                onChange={(event) => handleEstimateChange(event.target.value)}
              />
            </div>
          </div>

          <div className="offer-control">
            <div className="control-label">
              <label htmlFor="bid-cap-range">2. Set your walk-away number</label>
              <strong>{walkAwayNumber === null ? 'Set an estimate first' : formatMoney(walkAwayNumber)}</strong>
            </div>
            <p id="bid-cap-help">This is the highest offer your escalation clause can reach.</p>
            <input
              id="bid-cap-range"
              type="range"
              min={estimate ?? currentHouse.listingPrice}
              max={(estimate ?? currentHouse.listingPrice) + currentHouse.pot}
              step={500}
              value={(estimate ?? currentHouse.listingPrice) + allocation}
              disabled={!estimateValid}
              aria-describedby="bid-cap-help"
              aria-valuetext={walkAwayNumber === null ? undefined : formatMoney(walkAwayNumber)}
              onChange={(event) => setAllocation(Number.parseInt(event.target.value, 10) - (estimate ?? currentHouse.listingPrice))}
            />
            <div className="offer-equation" aria-live="polite">
              <span>{estimateValid ? formatMoney(estimate) : 'Appraisal'}</span>
              <span>+</span>
              <span>{formatMoney(allocation)} gap cash</span>
              <span>=</span>
              <strong>{walkAwayNumber === null ? '—' : formatMoney(walkAwayNumber)}</strong>
            </div>
          </div>

          <div className={`reserve-callout ${allocation > safeGapAmount ? 'reserve-callout--risk' : ''}`} role="status">
            {allocation > safeGapAmount ? (
              <><strong>Emergency cushion at risk.</strong> This limit could use {formatMoney(allocation - safeGapAmount)} of the cash meant for moving, repairs, and surprises.</>
            ) : (
              <><strong>Emergency cushion protected.</strong> If your estimate is right, this limit leaves at least {formatMoney(currentHouse.pot - allocation)} in cash.</>
            )}
          </div>

          <button className="primary-action" onClick={handleSubmit} disabled={!estimateValid}>
            Lock in {walkAwayNumber === null ? 'your number' : formatMoney(walkAwayNumber)}
          </button>
          <p className="fine-print">
            Affordability and Auction Discipline are separate. A later raise may still be affordable, but Auction Discipline scores whether you keep this pre-bidding limit.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default SetNumberScreen;

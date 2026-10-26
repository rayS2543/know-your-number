import { useState } from 'react';
import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { formatMoney, standingOffer } from '../game/logic';
import { headroomPercent } from '../game/presentation';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const BiddingScreen = ({ state, dispatch }: Props) => {
  const currentHouse = state.houses[state.currentHouseIndex];
  const playerOffer = state.playerOffers[state.currentHouseIndex];
  const { rivalBidIndex } = state.biddingProgress;
  const rivalBids = currentHouse.rivalBids;
  const highestRivalBid = rivalBidIndex === 0 ? null : rivalBids[rivalBidIndex - 1];
  const [newCap, setNewCap] = useState(playerOffer.cap + currentHouse.escalationStep);
  const minRaise = Math.max(playerOffer.cap, highestRivalBid ?? 0) + currentHouse.escalationStep;
  const raiseTo = Math.max(newCap, minRaise);
  const showCheckpoint = highestRivalBid !== null && highestRivalBid >= playerOffer.cap;
  const previewGap = Math.max(0, raiseTo - playerOffer.estimate);
  const safeGap = currentHouse.pot - currentHouse.reserveFloor;
  const headroom = headroomPercent(playerOffer.cap, playerOffer.estimate, highestRivalBid);
  const playerStandingOffer = highestRivalBid === null
    ? null
    : standingOffer(playerOffer.cap, highestRivalBid, currentHouse.escalationStep);
  const gapWarning = previewGap > currentHouse.pot
    ? 'This gap is larger than your entire spare-cash pot. The purchase could not close if your estimate is right.'
    : previewGap > safeGap
      ? `This would use ${formatMoney(previewGap - safeGap)} of the emergency cushion meant for moving, repairs, and surprises.`
      : '';

  const adjustRaise = (direction: -1 | 1) => {
    setNewCap(Math.max(minRaise, raiseTo + direction * currentHouse.escalationStep));
  };

  return (
    <main className="screen auction-screen">
      <header className="round-header auction-header">
        <div>
          <p className="eyebrow">Live offer room · House {state.currentHouseIndex + 1} of {state.houses.length}</p>
          <h1>{currentHouse.name}</h1>
        </div>
        <div className="live-badge"><span aria-hidden="true" /> Live bidding</div>
      </header>

      <div className="auction-layout">
        <section className="auction-stage" aria-labelledby="current-bid-title">
          <div className="auction-readout">
            <div className="rival-readout">
              <p className="eyebrow" id="current-bid-title">Highest rival bid</p>
              <p className={`money-display ${highestRivalBid !== null ? 'bid-arrival' : ''}`} key={highestRivalBid ?? 'waiting'} aria-live="polite">
                {highestRivalBid === null ? 'Waiting' : formatMoney(highestRivalBid)}
              </p>
            </div>
            <div className="standing-readout">
              <p className="eyebrow">Your standing offer</p>
              <p>{playerStandingOffer === null ? 'Not active yet' : formatMoney(playerStandingOffer)}</p>
            </div>
          </div>

          <section className="limit-meter" aria-labelledby="limit-title">
            <div className="limit-meter__header">
              <div>
                <p className="eyebrow" id="limit-title">Your walk-away number</p>
                <strong>{formatMoney(playerOffer.cap)}</strong>
              </div>
              <div className="limit-meter__headroom">
                <span>Headroom</span>
                <strong>{highestRivalBid === null ? formatMoney(playerOffer.cap - playerOffer.estimate) : formatMoney(Math.max(0, playerOffer.cap - highestRivalBid))}</strong>
              </div>
            </div>
            <div className="limit-track" aria-hidden="true"><span style={{ width: `${headroom}%` }} /></div>
            <div className="limit-scale"><span>{formatMoney(playerOffer.estimate)} appraisal</span><span>{formatMoney(playerOffer.cap)} limit</span></div>
          </section>

          {showCheckpoint ? (
            <section className="decision-panel" aria-labelledby="decision-title">
              <p className="eyebrow">Decision point</p>
              <h2 id="decision-title">The market crossed your line.</h2>
              <p>
                A rival bid {formatMoney(highestRivalBid)}. You set {formatMoney(playerOffer.cap)} as the highest number the evidence and your cash could support.
              </p>
              <p className="discipline-note">
                Rival bids changed, but the property evidence did not. Holding keeps full Auction Discipline. A first raise scores 5 of 15; another scores 0 of 15.
              </p>
              <button className="primary-action" onClick={() => dispatch({ type: 'HOLD_CAP' })}>Hold my number</button>
              <div className="raise-panel">
                <div>
                  <p className="eyebrow">Break the rule</p>
                  <p>Raise the walk-away number and accept a larger possible appraisal gap. A cash-safe raise can still break the pre-bidding rule.</p>
                </div>
                <div className="stepper" role="group" aria-label="Proposed new walk-away number">
                  <button aria-label="Decrease proposed limit" onClick={() => adjustRaise(-1)} disabled={raiseTo <= minRaise}>−</button>
                  <strong>{formatMoney(raiseTo)}</strong>
                  <button aria-label="Increase proposed limit" onClick={() => adjustRaise(1)}>+</button>
                </div>
                <p>If the appraisal matches your estimate, the gap would be <strong>{formatMoney(previewGap)}</strong>.</p>
                {gapWarning ? <p className="risk-message">{gapWarning}</p> : null}
                <button className="secondary-action secondary-action--danger" onClick={() => dispatch({ type: 'RAISE_CAP', payload: { newCap: raiseTo } })}>
                  Raise limit to {formatMoney(raiseTo)}
                </button>
              </div>
            </section>
          ) : (
            <div className="auction-action">
              {rivalBidIndex < rivalBids.length ? (
                <button className="primary-action" onClick={() => dispatch({ type: 'NEXT_BID' })}>
                  {rivalBidIndex === 0 ? 'Open the bidding' : 'Reveal next rival bid'}
                </button>
              ) : (
                <button className="primary-action" onClick={() => dispatch({ type: 'HOUSE_FINISHED' })}>Reveal the appraisal</button>
              )}
              <p>{rivalBids.length - rivalBidIndex} rival bid{rivalBids.length - rivalBidIndex === 1 ? '' : 's'} remaining</p>
            </div>
          )}
        </section>

        <aside className="bid-sheet" aria-labelledby="bid-sheet-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Offer record</p>
              <h2 id="bid-sheet-title">Bid trail</h2>
            </div>
          </div>
          {rivalBidIndex === 0 ? (
            <p className="empty-bids">No bids yet. Your escalation clause is ready.</p>
          ) : (
            <ol className="bid-timeline">
              {rivalBids.slice(0, rivalBidIndex).map((bid, index) => (
                <li className={index === rivalBidIndex - 1 ? 'bid-timeline__latest' : ''} key={`${bid}-${index}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><small>Rival offer</small><strong>{formatMoney(bid)}</strong></div>
                </li>
              ))}
            </ol>
          )}
          <div className="bid-sheet__rule">
            <span>Escalation step</span>
            <strong>{formatMoney(currentHouse.escalationStep)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default BiddingScreen;

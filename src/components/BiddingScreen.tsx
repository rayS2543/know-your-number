import { useState } from 'react';
import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { standingOffer } from '../game/logic';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const BiddingScreen = ({ state, dispatch }: Props) => {
  const currentHouse = state.houses[state.currentHouseIndex];
  const playerOffer = state.playerOffers[state.currentHouseIndex];
  const biddingProgress = state.biddingProgress;
  const rivalBids = currentHouse.rivalBids;
  const highestRivalBid = biddingProgress.rivalBidIndex === 0 ? null : rivalBids[biddingProgress.rivalBidIndex - 1];

  const [newCap, setNewCap] = useState<number>(playerOffer.cap + 3000);

  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const handleNextBid = () => {
    if (biddingProgress.rivalBidIndex < rivalBids.length) {
      dispatch({ type: 'NEXT_BID' });
    }
  };

  const handleHoldCap = () => {
    dispatch({ type: 'HOLD_CAP' });
  };

  // A raise must beat the highest rival bid, so the smallest raise is one step above it.
  const minRaise = Math.max(playerOffer.cap, highestRivalBid ?? 0) + 3000;
  const raiseTo = Math.max(newCap, minRaise);

  const handleRaiseCap = () => {
    dispatch({ type: 'RAISE_CAP', payload: { newCap: raiseTo } });
  };

  const handleCapChange = (step: number) => {
    setNewCap(Math.max(minRaise, raiseTo + step));
  };

  const showCheckpoint = highestRivalBid !== null && highestRivalBid >= playerOffer.cap;
  const previewGap = Math.max(0, raiseTo - playerOffer.estimate);
  const gapWarning = previewGap > currentHouse.pot
    ? 'Warning: if the appraisal matches your guess, this gap is more than all your spare cash, so you could not close.'
    : previewGap > playerOffer.allocation
      ? 'Warning: this is further above your guess than you planned to go.'
      : '';

  return (
    <div className="bidding-screen">
      <div className="bid-ladder">
        <h3>Bid Ladder</h3>
        <ul>
          {rivalBids.slice(0, biddingProgress.rivalBidIndex).map((bid, index) => (
            <li key={index}>{formatMoney(bid)}</li>
          ))}
        </ul>
      </div>
      <div className="current-bid">
        <h3>Highest Rival Bid</h3>
        {highestRivalBid !== null ? formatMoney(highestRivalBid) : 'No rival bids yet'}
      </div>
      <div className="standing-offer">
        <h3>Your Standing Offer</h3>
        {highestRivalBid !== null ? formatMoney(standingOffer(playerOffer.cap, highestRivalBid, currentHouse.escalationStep)) : 'Waiting for the first rival bid'}
      </div>
      <div className="your-cap">
        <h3>Your Walk Away Number</h3>
        {formatMoney(playerOffer.cap)}
      </div>
      <div className="headroom">
        <h3>Headroom</h3>
        {highestRivalBid !== null ? (
          <>
            {formatMoney(Math.max(0, playerOffer.cap - highestRivalBid))}
            <div className="progress-bar" style={{ width: `${Math.max(0, (playerOffer.cap - highestRivalBid) / playerOffer.cap) * 100}%` }}></div>
          </>
        ) : (
          'Waiting for the first rival bid'
        )}
      </div>
      {showCheckpoint ? (
        <div className="checkpoint">
          <h3>Checkpoint</h3>
          <p>
            A rival just bid <strong>{formatMoney(highestRivalBid ?? 0)}</strong>. That has reached your walk away number of{' '}
            <strong>{formatMoney(playerOffer.cap)}</strong>.
          </p>
          <p>Hold your number and you are out of this house. Or raise it and bid past the limit you set from the evidence.</p>
          <button onClick={handleHoldCap}>Hold My Number</button>
          <div className="raise-control">
            <p className="font-medium">Or raise your walk away number to:</p>
            <button onClick={() => handleCapChange(-3000)} disabled={raiseTo <= minRaise}>-</button>
            <span className="mx-3 font-semibold">{formatMoney(raiseTo)}</span>
            <button onClick={() => handleCapChange(3000)}>+</button>
            <p>If the appraisal matches your guess, you would pay {formatMoney(previewGap)} of the price in cash.</p>
            {gapWarning && <p className="gap-warning">{gapWarning}</p>}
            <button onClick={handleRaiseCap}>
              Raise My Cap to {formatMoney(raiseTo)}
            </button>
          </div>
        </div>
      ) : (
        <>
          {biddingProgress.rivalBidIndex < rivalBids.length ? (
            <button onClick={handleNextBid}>Next Rival Bid</button>
          ) : (
            <button onClick={() => dispatch({ type: 'HOUSE_FINISHED' })}>See the Appraisal</button>
          )}
        </>
      )}
    </div>
  );
};

export default BiddingScreen;

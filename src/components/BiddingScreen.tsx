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

  const handleRaiseCap = () => {
    dispatch({ type: 'RAISE_CAP', payload: { newCap } });
    setNewCap(newCap);
  };

  const handleCapChange = (step: number) => {
    const newCapValue = Math.max(playerOffer.cap + 3000, newCap + step);
    setNewCap(newCapValue);
  };

  const showCheckpoint = highestRivalBid !== null && highestRivalBid >= playerOffer.cap;
  const previewGap = Math.max(0, newCap - playerOffer.estimate);
  const gapWarning = previewGap > playerOffer.allocation ? 'Warning: Preview gap exceeds your allocation.' : previewGap > currentHouse.pot ? 'Warning: Preview gap exceeds the pot.' : '';

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
            {formatMoney(playerOffer.cap - highestRivalBid)}
            <div className="progress-bar" style={{ width: `${((playerOffer.cap - highestRivalBid) / playerOffer.cap) * 100}%` }}></div>
          </>
        ) : (
          'Waiting for the first rival bid'
        )}
      </div>
      {showCheckpoint ? (
        <div className="checkpoint">
          <h3>Checkpoint</h3>
          <p>A rival bid has reached your walk away number. Holding it means you are out.</p>
          <button onClick={handleHoldCap}>Hold My Number</button>
          <div className="raise-control">
            <button onClick={() => handleCapChange(-3000)} disabled={newCap <= playerOffer.cap}>-</button>
            <span>{formatMoney(newCap)}</span>
            <button onClick={() => handleCapChange(3000)}>+</button>
            <p>Preview gap: {formatMoney(previewGap)}</p>
            {gapWarning && <p className="gap-warning">{gapWarning}</p>}
            <button onClick={handleRaiseCap} disabled={newCap <= playerOffer.cap}>
              Raise My Cap to {formatMoney(newCap)}
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

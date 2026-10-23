import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { useState } from 'react';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const SetNumberScreen = ({ state, dispatch }: Props) => {
  const currentHouse = state.houses[state.currentHouseIndex];
  const [estimate, setEstimate] = useState<number | null>(null);
  const [allocation, setAllocation] = useState<number>(0);

  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace('.00', '');
  };

  const safeGapAmount = currentHouse.pot - currentHouse.reserveFloor;
  const walkAwayNumber = estimate !== null ? estimate + allocation : null;

  const handleEstimateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setEstimate(value);
  };

  const handleAllocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setAllocation(value);
  };

  const handleSubmit = () => {
    if (estimate !== null) {
      dispatch({
        type: 'SUBMIT_OFFER',
        payload: {
          estimate,
          allocation,
        },
      });
    }
  };

  return (
    <div className="set-number-screen">
      <div className="header-context">
        <h2>{currentHouse.name}</h2>
        <p>Asking Price: {formatMoney(currentHouse.listingPrice)}</p>
        <p>Spare Cash Pot: {formatMoney(currentHouse.pot)}</p>
        <p>Reserve Floor: {formatMoney(currentHouse.reserveFloor)}</p>
        <p>Safe Gap Amount: {formatMoney(safeGapAmount)}</p>
      </div>
      <div className="comparable-sales">
        <h3>Comparable Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Distance</th>
              <th>Size</th>
              <th>Condition</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {currentHouse.comps.map((comp) => (
              <tr key={comp.price}>
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
      <div className="inputs">
        <div className="input-group">
          <label>Your Estimated Appraised Value</label>
          <input
            type="range"
            min={Math.floor(currentHouse.listingPrice * 0.8 / 1000) * 1000}
            max={Math.ceil(currentHouse.listingPrice * 1.2 / 1000) * 1000}
            step={1000}
            value={estimate !== null ? estimate : ''}
            onChange={handleEstimateChange}
          />
          <input
            type="number"
            min={Math.floor(currentHouse.listingPrice * 0.8 / 1000) * 1000}
            max={Math.ceil(currentHouse.listingPrice * 1.2 / 1000) * 1000}
            step={1000}
            value={estimate !== null ? estimate : ''}
            onChange={handleEstimateChange}
            placeholder="Slide or type your estimate"
          />
        </div>
        <div className="input-group">
          <label>Gap Cash You Are Willing to Spend</label>
          <input
            type="range"
            min={0}
            max={currentHouse.pot}
            step={500}
            value={allocation}
            onChange={handleAllocationChange}
          />
          <input
            type="number"
            min={0}
            max={currentHouse.pot}
            step={500}
            value={allocation}
            onChange={handleAllocationChange}
          />
          <p>Cash left if you spend this: {formatMoney(currentHouse.pot - allocation)}</p>
        </div>
      </div>
      <div className="reserve-warning">
        {allocation > safeGapAmount ? (
          <div className="warning">
            This allocation dips into your reserve by {formatMoney(allocation - safeGapAmount)}. If you win near your cap, you will close with less than your reserve left.
          </div>
        ) : (
          <div className="neutral">
            Your reserve stays intact.
          </div>
        )}
      </div>
      <div className="walk-away-number">
        <h3>{walkAwayNumber !== null ? formatMoney(walkAwayNumber) : 'Set your estimate to see your number.'}</h3>
        <p>Your offer tops the highest rival bid by {currentHouse.escalationStep} at a time, up to this number and never above it.</p>
      </div>
      <button onClick={handleSubmit} disabled={estimate === null}>
        Submit Offer
      </button>
    </div>
  );
};

export default SetNumberScreen;

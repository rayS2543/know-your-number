import React from 'react';
import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';

interface DossierScreenProps {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const DossierScreen: React.FC<DossierScreenProps> = ({ state, dispatch }) => {
  const currentHouse = state.houses[state.currentHouseIndex];
  const totalScore = state.houseResults.reduce((acc, result) => acc + result.score.total, 0);

  return (
    <div className="dossier-screen">
      <div className="house-card">
        <h2>{currentHouse.name}</h2>
        <p>{currentHouse.blurb}</p>
        <p><strong>Asking price:</strong> ${currentHouse.listingPrice.toLocaleString()}</p>
        <p><strong>Beds:</strong> {currentHouse.beds}</p>
        <p><strong>Sq ft:</strong> {currentHouse.sqft}</p>
      </div>
      <table className="comps-table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Distance (mi)</th>
            <th>Sq ft Note</th>
            <th>Condition Note</th>
            <th>Sold Note</th>
          </tr>
        </thead>
        <tbody>
          {currentHouse.comps.map((comp, index) => (
            <tr key={index}>
              <td>${comp.price.toLocaleString()}</td>
              <td>{comp.distanceMi}</td>
              <td>{comp.sqftNote}</td>
              <td>{comp.conditionNote}</td>
              <td>{comp.soldNote}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cash-panel">
        <p><strong>Spare cash for a gap:</strong> ${currentHouse.pot.toLocaleString()}</p>
        <p><strong>Reserve to keep untouched:</strong> ${currentHouse.reserveFloor.toLocaleString()}</p>
        <p><strong>Safe gap amount:</strong> ${(currentHouse.pot - currentHouse.reserveFloor).toLocaleString()}</p>
      </div>
      <p className="reminder">Appraisers weight recent, nearby, similar size and condition sales most heavily.</p>
      <p className="progress">House {state.currentHouseIndex + 1} of 3</p>
      {totalScore > 0 && <p className="total-score">Total Score: {totalScore}</p>}
      <button onClick={() => dispatch({ type: 'SUBMIT_OFFER', payload: { estimate: 0, allocation: 0 } })}>Set Your Number</button>
    </div>
  );
};

export default DossierScreen;

import React from 'react';
import type { Dispatch } from 'react';
import type { Action } from '../game/useGame';

interface StartScreenProps {
  dispatch: Dispatch<Action>;
}

const StartScreen: React.FC<StartScreenProps> = ({ dispatch }) => {
  return (
    <div className="start-screen">
      <h1>Know Your Number</h1>
      <p>Learn to set a maximum offer you can defend, before a bidding war talks you out of it.</p>
      <p>Three houses, three separate offers. Treat each house as a fresh hunt with its own spare cash.</p>
      <p>Your down payment and closing costs are already set aside. This game is only about one thing: the gap between your offer and what the house appraises for.</p>
      <h2>How It Works</h2>
      <ol>
        <li>Study the recent sales near the house and estimate what it will appraise for. Appraisers weight recent, nearby, similar homes most, and discount outliers.</li>
        <li>Decide how much spare cash you can put toward a gap without breaking your reserve. Estimate plus gap cash is your walk away number.</li>
        <li>Bidding climbs toward your number. Hold it or raise it, and get scored on the quality of the decision, not just on winning.</li>
      </ol>
      <button onClick={() => dispatch({ type: 'START_GAME' })}>Start</button>
    </div>
  );
};

export default StartScreen;

import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

// Placeholder until its task builds the real screen.
const BiddingScreen = (_props: Props) => <div>BiddingScreen</div>;

export default BiddingScreen;

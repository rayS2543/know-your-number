import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

// Placeholder until its task builds the real screen.
const FinalResultsScreen = (_props: Props) => <div>FinalResultsScreen</div>;

export default FinalResultsScreen;

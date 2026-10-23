import React from 'react';
import { useGame, Action } from './game/useGame';
import StartScreen from './components/StartScreen';
import DossierScreen from './components/DossierScreen';
import SetNumberScreen from './components/SetNumberScreen';
import BiddingScreen from './components/BiddingScreen';
import RevealScreen from './components/RevealScreen';
import FinalResultsScreen from './components/FinalResultsScreen';

const App: React.FC = () => {
  const [state, dispatch] = useGame();

  let currentScreen;
  switch (state.phase) {
    case 'start':
      currentScreen = <StartScreen dispatch={dispatch} />;
      break;
    case 'dossier':
      currentScreen = <DossierScreen state={state} dispatch={dispatch} />;
      break;
    case 'setNumber':
      currentScreen = <SetNumberScreen state={state} dispatch={dispatch} />;
      break;
    case 'bidding':
      currentScreen = <BiddingScreen state={state} dispatch={dispatch} />;
      break;
    case 'reveal':
      currentScreen = <RevealScreen state={state} dispatch={dispatch} />;
      break;
    case 'finalResults':
      currentScreen = <FinalResultsScreen state={state} dispatch={dispatch} />;
      break;
    default:
      currentScreen = <div>Unknown phase</div>;
  }

  return <div className="app">{currentScreen}</div>;
};

export default App;

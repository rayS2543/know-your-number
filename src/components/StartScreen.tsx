import React from 'react';
import type { Dispatch } from 'react';
import type { Action } from '../game/useGame';

interface StartScreenProps {
  dispatch: Dispatch<Action>;
}

const steps = [
  { title: 'Guess the appraisal', text: 'Look at recent nearby sales and guess what the bank will say the house is worth.' },
  { title: 'Set your limit', text: 'Pick the most gap you could cover from your spare cash. Your guess plus that is the most you will bid.' },
  { title: 'Hold or fold', text: 'When rivals hit your limit, stick to it or break it. You are scored on the decision, not just on winning.' },
];

const StartScreen: React.FC<StartScreenProps> = ({ dispatch }) => {
  return (
    <div className="start-screen">
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 p-6 text-white shadow-lg">
        <h1 className="text-4xl">Know Your Number</h1>
        <p className="mt-2 text-lg text-blue-50">Set a bid limit you can defend before a bidding war talks you out of it.</p>
      </div>
      <p>
        Banks lend based on what a house appraises for, not what you offer. If you pay more, you cover the difference with your own cash.
        You will bid on three houses, each with its own spare cash. Your down payment and closing costs are already covered.
      </p>
      <h2>How it works</h2>
      <ol className="!list-none !pl-0">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{i + 1}</span>
            <span><strong>{s.title}.</strong> {s.text}</span>
          </li>
        ))}
      </ol>
      <button className="w-full py-3 text-lg" onClick={() => dispatch({ type: 'START_GAME' })}>Start</button>
    </div>
  );
};

export default StartScreen;

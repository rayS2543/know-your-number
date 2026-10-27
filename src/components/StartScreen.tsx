import type { Dispatch } from 'react';
import type { Action } from '../game/useGame';

interface StartScreenProps {
  dispatch: Dispatch<Action>;
}

const steps = [
  { number: '01', title: 'Read the evidence', text: 'Use nearby sales to estimate the value a bank appraiser can defend.' },
  { number: '02', title: 'Keep a cash cushion', text: 'Each scenario gives you gap cash and an emergency amount to keep for moving, repairs, and surprises.' },
  { number: '03', title: 'Hold the line', text: 'Auction Discipline measures whether you keep the limit you wrote before rival bids created pressure.' },
];

const StartScreen = ({ dispatch }: StartScreenProps) => (
  <main className="screen start-screen">
    <header className="brand-lockup">
      <span>Know Your Number</span>
      <span>First-time buyer field exercise</span>
    </header>

    <section className="start-hero">
      <div className="start-copy">
        <p className="eyebrow">A three-house bidding simulation</p>
        <h1>Know your number before the room gets loud.</h1>
        <p className="start-lede">
          A lender works from the appraisal, not your offer. Price the house, protect your cash, and decide what winning is actually worth.
        </p>
        <button className="primary-action" onClick={() => dispatch({ type: 'START_GAME' })}>Open the first property file</button>
      </div>

      <aside className="formula-file" aria-label="Walk-away number formula">
        <div className="formula-file__stamp">Offer rule</div>
        <p className="eyebrow">Write this before bidding</p>
        <div className="formula-line"><span>Estimated appraisal</span><strong>Evidence</strong></div>
        <div className="formula-operator" aria-hidden="true">+</div>
        <div className="formula-line"><span>Cash pot minus emergency cushion</span><strong>Safe gap cash</strong></div>
        <div className="formula-total"><span>= Walk-away number</span><strong>Your line</strong></div>
        <p>Winning above this number is not a better outcome.</p>
      </aside>
    </section>

    <section className="briefing" aria-labelledby="briefing-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your assignment</p>
          <h2 id="briefing-title">Three decisions. One rule.</h2>
        </div>
        <p>You are scored on judgment, not on buying every house.</p>
      </div>
      <ol>
        {steps.map((step) => (
          <li key={step.number}>
            <span>{step.number}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>
        ))}
      </ol>
    </section>
  </main>
);

export default StartScreen;

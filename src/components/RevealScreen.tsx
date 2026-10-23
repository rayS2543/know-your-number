import type { Dispatch } from 'react';
import type { GameState } from '../game/types';
import type { Action } from '../game/useGame';
import { COMPONENTS, explain, formatMoney } from '../game/explain';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const RevealScreen = ({ state, dispatch }: Props) => {
  const r = state.houseResults[state.currentHouseIndex];
  const { house, playerOffer, score, settlement } = r;
  const last = state.currentHouseIndex >= state.houses.length - 1;
  const soldFor = house.rivalBids[house.rivalBids.length - 1];

  let status = 'Lost';
  if (r.won) {
    status = !settlement || !settlement.canClose ? 'Won, but cannot close' : settlement.closesSafely ? 'Closes safely' : 'Closes, but breaks your reserve';
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h2 className="text-2xl font-bold">{r.won ? `You bought ${house.name}` : `You let ${house.name} go`}</h2>
      <p className="font-medium">{status}</p>

      <div className="rounded-xl border-2 border-blue-600 bg-blue-50 p-4">
        <p className="text-sm text-gray-600">Actual appraisal</p>
        <p className="text-4xl font-bold">{formatMoney(house.actualAppraisal)}</p>
        <p className="mt-2">{house.appraisalDerivation}</p>
      </div>

      {r.won && settlement ? (
        <table className="w-full text-left">
          <tbody>
            <tr><td>Winning price</td><td>{formatMoney(r.winningPrice ?? 0)}</td></tr>
            <tr><td>Actual appraisal</td><td>{formatMoney(house.actualAppraisal)}</td></tr>
            <tr><td>Gap due</td><td>{formatMoney(settlement.gapDue)}</td></tr>
            <tr><td>Spare cash pot</td><td>{formatMoney(house.pot)}</td></tr>
            <tr><td>Cash left after the gap</td><td>{formatMoney(settlement.potLeft)}</td></tr>
            <tr><td>Reserve floor</td><td>{formatMoney(house.reserveFloor)}</td></tr>
            <tr><td>Reserve survived</td><td>{settlement.closesSafely ? 'Yes' : 'No'}</td></tr>
          </tbody>
        </table>
      ) : (
        <p>
          The house sold for {formatMoney(soldFor)}. At that price, the gap would have been{' '}
          {formatMoney(Math.max(0, soldFor - house.actualAppraisal))}.
        </p>
      )}
      <p className="italic">{house.rivalNote}</p>

      <div className="rounded-xl border p-4">
        <h3 className="font-semibold">Score</h3>
        {COMPONENTS.map((c) => (
          <div key={c.key} className="mt-2">
            <div className="flex justify-between">
              <span>{c.label}</span>
              <span>{score[c.key]} / {c.max}</span>
            </div>
            {score[c.key] < c.max && <p className="text-sm text-gray-600">{explain(c.key, r)}</p>}
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t pt-2 font-bold">
          <span>House total</span>
          <span>{score.total} / 100</span>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Your numbers: estimate {formatMoney(playerOffer.estimate)}, bid above guess {formatMoney(playerOffer.allocation)}, original cap{' '}
        {formatMoney(playerOffer.estimate + playerOffer.allocation)}, final cap {formatMoney(playerOffer.cap)}, raises {r.raises}.
      </p>

      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        onClick={() => dispatch({ type: last ? 'SHOW_FINAL_RESULTS' : 'BEGIN_HOUSE' })}
      >
        {last ? 'See Final Results' : 'Next House'}
      </button>
    </div>
  );
};

export default RevealScreen;

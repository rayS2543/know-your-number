import { useReducer, Dispatch } from 'react';
import { House, PlayerOffer, HouseResult, GameState, Settlement, HouseScore } from './types';
import { winningPrice, settleHouse, scoreHouse } from './logic';
import { houses } from './houses';

interface Action {
  type: 
    | 'START_GAME'
    | 'BEGIN_HOUSE'
    | 'SUBMIT_OFFER'
    | 'NEXT_BID'
    | 'RAISE_CAP'
    | 'HOLD_CAP'
    | 'HOUSE_FINISHED'
    | 'SHOW_FINAL_RESULTS'
    | 'PLAY_AGAIN';
  payload?: any;
}

const initialState: GameState = {
  phase: 'start',
  currentHouseIndex: 0,
  houses: houses,
  playerOffers: [],
  houseResults: [],
  biddingProgress: {
    rivalBidIndex: 0,
    checkpointOpen: false,
    raises: 0,
    finalCap: 0,
  },
};

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        phase: 'dossier',
      };
    case 'BEGIN_HOUSE':
      return {
        ...state,
        phase: 'dossier',
        currentHouseIndex: state.currentHouseIndex + 1,
      };
    case 'SUBMIT_OFFER':
      return {
        ...state,
        phase: 'bidding',
        playerOffers: [
          ...state.playerOffers,
          {
            estimate: action.payload.estimate,
            allocation: action.payload.allocation,
            cap: action.payload.estimate + action.payload.allocation,
          },
        ],
        biddingProgress: {
          rivalBidIndex: 0,
          checkpointOpen: false,
          raises: 0,
          finalCap: action.payload.estimate + action.payload.allocation,
        },
      };
    case 'NEXT_BID':
      return {
        ...state,
        biddingProgress: {
          ...state.biddingProgress,
          rivalBidIndex: state.biddingProgress.rivalBidIndex + 1,
        },
      };
    case 'RAISE_CAP':
      return {
        ...state,
        biddingProgress: {
          ...state.biddingProgress,
          finalCap: action.payload.newCap,
          raises: state.biddingProgress.raises + 1,
        },
      };
    case 'HOLD_CAP':
      const currentHouse = state.houses[state.currentHouseIndex];
      const playerOffer = state.playerOffers[state.currentHouseIndex];
      const holdCapSettlement = settleHouse(playerOffer.cap, currentHouse.actualAppraisal, currentHouse.pot, currentHouse.reserveFloor);
      const holdCapScore = scoreHouse({
        houseId: currentHouse.id as 1 | 2 | 3,
        estimate: playerOffer.estimate,
        actualAppraisal: currentHouse.actualAppraisal,
        allocation: playerOffer.allocation,
        pot: currentHouse.pot,
        reserveFloor: currentHouse.reserveFloor,
        raises: state.biddingProgress.raises,
        won: false,
        canClose: holdCapSettlement.canClose,
        closesSafely: holdCapSettlement.closesSafely,
      });
      return {
        ...state,
        phase: 'reveal',
        houseResults: [
          ...state.houseResults,
          {
            house: currentHouse,
            playerOffer: playerOffer,
            settlement: holdCapSettlement,
            won: false,
            winningPrice: null,
            score: holdCapScore,
          },
        ],
      };
    case 'HOUSE_FINISHED':
      const houseIndex = state.currentHouseIndex;
      const house = state.houses[houseIndex];
      const offer = state.playerOffers[houseIndex];
      const winningPriceResult = winningPrice(offer.cap, house.rivalBids[state.biddingProgress.rivalBidIndex], house.escalationStep);
      const won = winningPriceResult !== null;
      const houseFinishedSettlement = won ? settleHouse(winningPriceResult, house.actualAppraisal, house.pot, house.reserveFloor) : null;
      const houseFinishedScore = scoreHouse({
        houseId: house.id as 1 | 2 | 3,
        estimate: offer.estimate,
        actualAppraisal: house.actualAppraisal,
        allocation: offer.allocation,
        pot: house.pot,
        reserveFloor: house.reserveFloor,
        raises: state.biddingProgress.raises,
        won: won,
        canClose: houseFinishedSettlement?.canClose ?? false,
        closesSafely: houseFinishedSettlement?.closesSafely ?? false,
      });
      return {
        ...state,
        phase: 'reveal',
        houseResults: [
          ...state.houseResults,
          {
            house: house,
            playerOffer: offer,
            settlement: houseFinishedSettlement ?? null,
            won: won,
            winningPrice: winningPriceResult,
            score: houseFinishedScore,
          },
        ],
      };
    case 'SHOW_FINAL_RESULTS':
      return {
        ...state,
        phase: 'finalResults',
      };
    case 'PLAY_AGAIN':
      return initialState;
    default:
      return state;
  }
}

export function useGame(): [GameState, Dispatch<Action>] {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return [state, dispatch];
}

export type { Action };

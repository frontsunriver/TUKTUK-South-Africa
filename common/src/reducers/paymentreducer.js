import {
    FETCH_PAYMENT_METHODS,
    FETCH_PAYMENT_METHODS_SUCCESS,
    FETCH_PAYMENT_METHODS_FAILED,
    UPDATE_WALLET_BALANCE,
    UPDATE_WALLET_BALANCE_SUCCESS,
    UPDATE_WALLET_BALANCE_FAILED,
    CLEAR_PAYMENT_MESSAGES,
} from "../store/types";

export const INITIAL_STATE = {
    providers: [], 
    message:null
}

export const paymentreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_PAYMENT_METHODS:
          return {
            ...state
          };
        case FETCH_PAYMENT_METHODS_SUCCESS:
          return {
            ...state,
            providers: action.payload
          };
        case FETCH_PAYMENT_METHODS_FAILED:
          return {
            ...state,
            message: action.payload
          };
        case UPDATE_WALLET_BALANCE:
          return {
            ...state
          };
        case UPDATE_WALLET_BALANCE_SUCCESS:
          return {
            ...state,
            message: action.payload
          };
        case UPDATE_WALLET_BALANCE_FAILED:
          return {
            ...state,
            message: action.payload
          };
        case CLEAR_PAYMENT_MESSAGES:
          return {
            ...state,
            message:null
          };
        default:
          return state;
      }
};
import {
  FETCH_CANCEL_REASONS,
  FETCH_CANCEL_REASONS_SUCCESS,
  FETCH_CANCEL_REASONS_FAILED,
  EDIT_CANCELLATION_REASON
} from "../store/types";

const INITIAL_STATE = {
  simple: [],
  complex: [],
  loading: false,
  error: {
    flag: false,
    msg: null
  }
}

export const cancelreasonreducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CANCEL_REASONS:
      return {
        ...state,
        loading: true
      };
    case FETCH_CANCEL_REASONS_SUCCESS:
      return {
        ...state,
        simple: action.payload.simple,
        complex: action.payload.complex,
        loading: false
      };
    case FETCH_CANCEL_REASONS_FAILED:
      return {
        ...state,
        simple:[],
        complex:[],
        loading: false,
        error: {
          flag: true,
          msg: action.payload
        }
      };
    case EDIT_CANCELLATION_REASON:
      return state;
    default:
      return state;
  }
};
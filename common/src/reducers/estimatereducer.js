import {
  FETCH_ESTIMATE,
  FETCH_ESTIMATE_SUCCESS,
  FETCH_ESTIMATE_FAILED,
  CLEAR_ESTIMATE
} from "../store/types";

const INITIAL_STATE = {
  estimate: null,
  loading: false,
  error: {
    flag: false,
    msg: null
  }
}

export const estimatereducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ESTIMATE:
      return {
        ...state,
        loading: true
      };
    case FETCH_ESTIMATE_SUCCESS:
      return {
        ...state,
        estimate: action.payload,
        loading: false
      };
    case FETCH_ESTIMATE_FAILED:
      return {
        ...state,
        estimate: null,
        loading: false,
        error: {
          flag: true,
          msg: action.payload
        }
      };
    case CLEAR_ESTIMATE:
      return INITIAL_STATE;
    default:
      return state;
  }
};
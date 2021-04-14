import {
  CONFIRM_BOOKING,
  CONFIRM_BOOKING_SUCCESS,
  CONFIRM_BOOKING_FAILED,
  CLEAR_BOOKING
} from "../store/types";

const INITIAL_STATE = {
  booking: null,
  loading: false,
  error: {
    flag: false,
    msg: null
  }
}

export const bookingreducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CONFIRM_BOOKING:
      return {
        ...state,
        loading: true
      };
    case CONFIRM_BOOKING_SUCCESS:
      return {
        ...state,
        booking: action.payload,
        loading: false
      };
    case CONFIRM_BOOKING_FAILED:
      return {
        ...state,
        booking: null,
        loading: false,
        error: {
          flag: true,
          msg: action.payload
        }
      };
    case CLEAR_BOOKING:
      return INITIAL_STATE;
    default:
      return state;
  }
};
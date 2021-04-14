import {
  FETCH_BOOKINGS,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAILED,
  UPDATE_BOOKING,
  CANCEL_BOOKING
} from "../store/types";

const INITIAL_STATE = {
  bookings: null,
  active: null,
  tracked: null,
  loading: false,
  error: {
    flag: false,
    msg: null
  }
}

export const bookingslistreducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_BOOKINGS:
      return {
        ...state,
        loading: true
      };
    case FETCH_BOOKINGS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case FETCH_BOOKINGS_FAILED:
      return {
        ...state,
        bookings: null,
        active:null,
        tracked:null,
        loading: false,
        error: {
          flag: true,
          msg: action.payload
        }
      };
    case UPDATE_BOOKING:
      return {
        ...state
      }      
    case CANCEL_BOOKING:
      return {
        ...state
      };
    default:
      return state;
  }
};
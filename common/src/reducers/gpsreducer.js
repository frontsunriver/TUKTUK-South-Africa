import {
    UPDATE_GPS_LOCATION,
  } from "../store/types";
  
  const INITIAL_STATE = {
    location: null
  }
export const gpsreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_GPS_LOCATION:
            return {
                location: action.payload,
            };
        default:
            return state;
    }
};
import {
    FETCH_BOOKING_LOCATION,
    FETCH_BOOKING_LOCATION_SUCCESS,
    FETCH_BOOKING_LOCATION_FAILED,
    STOP_LOCATION_FETCH
} from "../store/types";
import { language } from 'config';

export const fetchBookingLocations = (bookingId) => (dispatch) => (firebase) => {

    const {
        trackingRef
    } = firebase;

    dispatch({
        type: FETCH_BOOKING_LOCATION,
        payload: bookingId,
    });
    trackingRef(bookingId).limitToLast(1).on("value", (snapshot) => {
        if (snapshot.val()) {
            let data = snapshot.val();
            const locations = Object.keys(data)
                .map((i) => {
                    return data[i]
                });
            if (locations.length == 1) {
                dispatch({
                    type: FETCH_BOOKING_LOCATION_SUCCESS,
                    payload: locations[0]
                });
            }
            else {
                dispatch({
                    type: FETCH_BOOKING_LOCATION_FAILED,
                    payload: language.location_fetch_error,
                });
            }
        } else {
            dispatch({
                type: FETCH_BOOKING_LOCATION_FAILED,
                payload: language.location_fetch_error,
            });
        }
    });
};

export const stopLocationFetch = (bookingId) => (dispatch) => (firebase) => {

    const {
        trackingRef
    } = firebase;

    dispatch({
        type: STOP_LOCATION_FETCH,
        payload: bookingId,
    });
    trackingRef(bookingId).off();
}
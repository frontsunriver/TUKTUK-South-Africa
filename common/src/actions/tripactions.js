import {
    UPDATE_TRIP_PICKUP,
    UPDATE_TRIP_DROP,
    UPDATE_TRIP_CAR,
    UPDATE_SELECTED_POINT_TYPE,
    CLEAR_TRIP_POINTS
} from "../store/types";

export const updateTripPickup = (pickupAddress) => (dispatch) => (firebase) => {
    dispatch({
        type: UPDATE_TRIP_PICKUP,
        payload: pickupAddress
    });
};

export const updateTripDrop = (dropAddress) => (dispatch) => (firebase) => {
    dispatch({
        type: UPDATE_TRIP_DROP,
        payload: dropAddress
    });
};

export const updateTripCar = (selectedCar) => (dispatch) => (firebase) => {
    dispatch({
        type: UPDATE_TRIP_CAR,
        payload: selectedCar
    });
};

export const updatSelPointType = (selection) => (dispatch) => (firebase) => {
    dispatch({
        type: UPDATE_SELECTED_POINT_TYPE,
        payload: selection
    });
};

export const clearTripPoints = () => (dispatch) => (firebase) => {
    dispatch({
        type: CLEAR_TRIP_POINTS,
        payload: null
    });
};



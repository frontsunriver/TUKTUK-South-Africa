import {
  FETCH_CAR_TYPES,
  FETCH_CAR_TYPES_SUCCESS,
  FETCH_CAR_TYPES_FAILED,
  EDIT_CAR_TYPE
} from "../store/types";
import { language } from 'config';

export const fetchCarTypes = () => (dispatch) => (firebase) => {

  const {
    carTypesRef
  } = firebase;

  dispatch({
    type: FETCH_CAR_TYPES,
    payload: null
  });
  carTypesRef.on("value", snapshot => {
    if (snapshot.val()) {
      dispatch({
        type: FETCH_CAR_TYPES_SUCCESS,
        payload: snapshot.val()
      });
    } else {
      dispatch({
        type: FETCH_CAR_TYPES_FAILED,
        payload: language.no_cars
      });
    }
  });
};

export const editCarType = (carTypes, method) => (dispatch) => (firebase) => {

  const {
    carTypesRef
  } = firebase;

  dispatch({
    type: EDIT_CAR_TYPE,
    payload: method
  });
  carTypesRef.set(carTypes);
}
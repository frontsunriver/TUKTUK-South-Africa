import {
    FETCH_ALL_USERS_EXCEPTLOCATION,
    FETCH_ALL_USERS_SUCCESS_EXCEPTLOCATION,
    FETCH_ALL_USERS_FAILED_EXCEPTLOCATION,
    FETCH_ALL_USERS_END_EXCEPTLOCATION
  } from "../store/types";
  import { store } from '../store/store';
  export const fetchUsersExcept = () => (dispatch) => (firebase) => {
  
    const {
      usersRef
    } = firebase;
  
    dispatch({
      type: FETCH_ALL_USERS_EXCEPTLOCATION,
      payload: null
    });
    usersRef.on("value", snapshot => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const arr = Object.keys(data)
        .filter(i => data[i].usertype !== 'admin' || data[i].usertype !== 'fleetadmin')
        .map(i => {
                const {location,ratings,...dataExceptLocation} = data[i];
                dataExceptLocation.id = i;
          return dataExceptLocation;
        });
         const originalUsersData = store.getState().usersdataExcept.users;
        if(JSON.stringify(originalUsersData) !== JSON.stringify(arr)){
          dispatch({
            type: FETCH_ALL_USERS_SUCCESS_EXCEPTLOCATION,
            payload: arr
          });
        }else{
          if(store.getState().usersdataExcept.loading){
            dispatch({
              type: FETCH_ALL_USERS_END_EXCEPTLOCATION,
            });
          }
        }          
      } else {
        dispatch({
          type: FETCH_ALL_USERS_FAILED_EXCEPTLOCATION,
          payload: "No users except location available."
        });
      }
    });
  };
 
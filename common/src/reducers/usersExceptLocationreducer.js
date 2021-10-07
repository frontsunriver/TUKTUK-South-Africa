import { 
    FETCH_ALL_USERS_EXCEPTLOCATION,
    FETCH_ALL_USERS_SUCCESS_EXCEPTLOCATION,
    FETCH_ALL_USERS_FAILED_EXCEPTLOCATION,
    FETCH_ALL_USERS_END_EXCEPTLOCATION
  } from "../store/types";
  
  export const INITIAL_STATE = {
    users:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export const usersExceptLocationreducer =  (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_ALL_USERS_EXCEPTLOCATION:
        return {
          ...state,
          loading:true
        };
      case FETCH_ALL_USERS_SUCCESS_EXCEPTLOCATION:
        return {
          ...state,
          users:action.payload,
          loading:false
        };
      case FETCH_ALL_USERS_FAILED_EXCEPTLOCATION:
        return {
          ...state,
          users:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
      case FETCH_ALL_USERS_END_EXCEPTLOCATION:
        return {
          ...state,
          loading:false
        };
      default:
        return state;
    }
  };
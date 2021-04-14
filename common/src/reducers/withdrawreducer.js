import { 
  FETCH_WITHDRAWS,
  FETCH_WITHDRAWS_SUCCESS,
  FETCH_WITHDRAWS_FAILED,
  EDIT_WITHDRAWS
  } from "../store/types";
  
  export const INITIAL_STATE = {
    withdraws:null,
    loading: false,
    error:{
      flag:false,
      msg: null
    }
  }
  
  export const withdrawreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_WITHDRAWS:
        return {
          ...state,
          loading:true
        };
      case FETCH_WITHDRAWS_SUCCESS:
        return {
          ...state,
          withdraws:action.payload,
          loading:false
        };
      case FETCH_WITHDRAWS_FAILED:
        return {
          ...state,
          withdraws:null,
          loading:false,
          error:{
            flag:true,
            msg:action.payload
          }
        };
      case EDIT_WITHDRAWS:
        return state;
      default:
        return state;
    }
  };
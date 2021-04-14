import {
    FETCH_TASKS,
    FETCH_TASKS_SUCCESS,
    FETCH_TASKS_FAILED,
    ACCEPT_TASK,
    CANCEL_TASK,
} from "../store/types";

const INITIAL_STATE = {
    tasks: null,
    loading: false,
    error: {
        flag: false,
        msg: null
    }
}

export const tasklistreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_TASKS:
            return {
                ...state,
                loading: true
            };
        case FETCH_TASKS_SUCCESS:
            return {
                ...state,
                tasks: action.payload,
                loading: false
            };
        case FETCH_TASKS_FAILED:
            return {
                ...state,
                tasks: null,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case ACCEPT_TASK:
            return {
                ...state
            }; 
        case CANCEL_TASK:
            return {
                ...state
            };
        default:
            return state;
    }
};
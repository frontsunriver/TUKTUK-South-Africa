import {
    FETCH_PAYMENT_METHODS,
    FETCH_PAYMENT_METHODS_SUCCESS,
    FETCH_PAYMENT_METHODS_FAILED,
    UPDATE_WALLET_BALANCE,
    UPDATE_WALLET_BALANCE_SUCCESS,
    UPDATE_WALLET_BALANCE_FAILED,
    CLEAR_PAYMENT_MESSAGES,
    UPDATE_USER_PROFILE
} from "../store/types";

import { 
    cloud_function_server_url,
    language
} from 'config';
import { RequestPushMsg } from '../other/NotificationFunctions';

export const fetchPaymentMethods = () => (dispatch) => (firebase) => {

    dispatch({
        type: FETCH_PAYMENT_METHODS,
        payload: null,
    });
    fetch(cloud_function_server_url + '/get_providers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.length > 0) {
                dispatch({
                    type: FETCH_PAYMENT_METHODS_SUCCESS,
                    payload: responseJson,
                });
            }else{
                dispatch({
                    type: FETCH_PAYMENT_METHODS_FAILED,
                    payload: language.no_provider_found,
                });
            }
        })
        .catch((error) => {
            dispatch({
                type: FETCH_PAYMENT_METHODS_FAILED,
                payload: language.provider_fetch_error + ": " + error.toString(),
            });
        });
};

export const clearMessage = () => (dispatch) => (firebase) => {
    dispatch({
        type: CLEAR_PAYMENT_MESSAGES,
        payload: null,
    });    
};


export const addToWallet = (uid, amount) => (dispatch) => (firebase) => {
    const {
        walletBalRef,
        walletHistoryRef,
        singleUserRef,
    } = firebase;

    dispatch({
        type: UPDATE_WALLET_BALANCE,
        payload: null
    });

    singleUserRef(uid).once("value", snapshot => {
        if (snapshot.val()) {
            let walletBalance = snapshot.val().walletBalance;
            walletBalance = parseFloat(walletBalance) + parseFloat(amount);
            let details = {
                type: 'Credit',
                amount: amount,
                date: new Date().toString(),
                txRef: 'AdminCredit'
            }
            walletBalRef(uid).set(walletBalance).then(() => {
                walletHistoryRef(uid).push(details).then(()=>{
                    dispatch({
                        type: UPDATE_WALLET_BALANCE_SUCCESS,
                        payload: language.wallet_updated
                    });
                }).catch(error=>{
                    dispatch({
                        type: UPDATE_WALLET_BALANCE_FAILED,
                        payload: error.code + ": " + error.message,
                    });            
                })
                RequestPushMsg(snapshot.val().pushToken, language.notification_title, language.wallet_updated);
            }).catch(error=>{
                dispatch({
                    type: UPDATE_WALLET_BALANCE_FAILED,
                    payload: error.code + ": " + error.message,
                });
            });
            
        }
    });
};


export const updateWalletBalance = (balance, details) => (dispatch) => (firebase) => {

    const {
        walletBalRef,
        walletHistoryRef,
        auth,
        singleUserRef,
        withdrawRef
    } = firebase;
    
    let uid = auth.currentUser.uid;
    dispatch({
        type: UPDATE_WALLET_BALANCE,
        payload: null
    });
    walletBalRef(uid).set(balance).then(() => {
        walletHistoryRef(uid).push(details).then(()=>{
            singleUserRef(uid).once("value", snapshot => {
                if (snapshot.val()) {
                    let profile = snapshot.val();
                    dispatch({
                        type: UPDATE_USER_PROFILE,
                        payload: profile
                    });
                    dispatch({
                        type: UPDATE_WALLET_BALANCE_SUCCESS,
                        payload: language.wallet_updated
                    });
                    RequestPushMsg(snapshot.val().pushToken, language.notification_title, language.wallet_updated);
                    if(details.type == 'Withdraw'){
                        withdrawRef.push({
                            uid : uid,
                            name : profile.firstName +  ' ' + profile.lastName,
                            amount : details.amount,
                            date : details.date,
                            bankName : profile.bankName? profile.bankName : '',
                            bankCode : profile.bankCode? profile.bankCode : '',
                            bankAccount : profile.bankAccount? profile.bankAccount : '',
                            processed:false
                        });
                    }
                }
            }); 
        }).catch(error=>{
            dispatch({
                type: UPDATE_WALLET_BALANCE_FAILED,
                payload: error.code + ": " + error.message,
            });            
        })
    }).catch(error=>{
        dispatch({
            type: UPDATE_WALLET_BALANCE_FAILED,
            payload: error.code + ": " + error.message,
        });
    });
};

import React,{ useEffect, useContext } from 'react';
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import {language} from 'config';
import { FirebaseContext } from 'common';

function AuthLoading(props) {
    const { api } = useContext(FirebaseContext);
    const {
        fetchUser,
        fetchCarTypes,
        fetchSettings, 
        fetchBookings,
        fetchCancelReasons,
        fetchPromos,
        fetchDriverEarnings,
        fetchUsers,
        fetchNotifications,
        fetchEarningsReport,
        signOut,
        fetchWithdraws,
    } = api;
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    useEffect(()=>{
        dispatch(fetchUser());
        dispatch(fetchCarTypes());
        dispatch(fetchSettings());
    },[dispatch,fetchUser,fetchCarTypes,fetchSettings]);

    useEffect(()=>{
        if(auth.info){
            if(auth.info.profile){
                let role = auth.info.profile.usertype;
                if(role === 'rider'){
                    dispatch(fetchBookings(auth.info.uid,role));
                    dispatch(fetchCancelReasons());
                }
                else if(role === 'driver'){
                    dispatch(fetchBookings(auth.info.uid,role));
                }
                else if(role === 'admin'){
                    dispatch(fetchUsers());
                    dispatch(fetchBookings(auth.info.uid,role));
                    dispatch(fetchPromos());
                    dispatch(fetchDriverEarnings(auth.info.uid,role));
                    dispatch(fetchNotifications());
                    dispatch(fetchEarningsReport());
                    dispatch(fetchCancelReasons());
                    dispatch(fetchWithdraws());
                }
                else if(role === 'fleetadmin'){
                    dispatch(fetchUsers());
                    dispatch(fetchBookings(auth.info.uid,role));
                    dispatch(fetchDriverEarnings(auth.info.uid,role));
                }
                else{
                    alert(language.not_valid_user_type);
                    dispatch(signOut());
                }
            }else{
                alert(language.user_issue_contact_admin);
                dispatch(signOut());
            }
        }
    },[auth.info,dispatch,fetchBookings,fetchCancelReasons,fetchDriverEarnings,fetchEarningsReport,fetchNotifications,fetchPromos,fetchUsers,fetchWithdraws,signOut]);

    return (
        auth.loading? <CircularLoading/>:props.children
    )
}

export default AuthLoading;
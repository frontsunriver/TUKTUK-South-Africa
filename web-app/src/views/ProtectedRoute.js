import React from 'react';
import {Route,Redirect} from 'react-router-dom';
import { useSelector } from "react-redux";
import ResponsiveDrawer from '../components/ResponsiveDrawer';
import { features } from 'config';

function matchUser(permit, usertype){
    let permitions = permit? permit.split(',') : [];
    let permitted = false;
    for(let i=0;i<permitions.length;i++){
        permitted = usertype === permitions[i]?true:false
        if(permitted) break;
    }
    return permitted;
}

function ProtectedRoute({ component: Component, permit, ...rest }) {
    const auth = useSelector(state => state.auth);
    return(
        <Route {...rest} render={props => (
            auth.info && auth.info.profile && matchUser(permit,auth.info.profile.usertype)?
            <ResponsiveDrawer><Component {...props} /></ResponsiveDrawer>
            : features.WebsitePagesEnabled?<Redirect to="/login" />:<Redirect to="/" />
        )} />
    )
}

export default ProtectedRoute;
import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import "assets/scss/material-kit-react.scss?v=1.9.0";

import LandingPage from "./views/LandingPage.js";
import LoginPage from "./views/LoginPage.js";
import PrivacyPolicy from "./views/PrivacyPolicy.js";
import AboutUs from "./views/AboutUs";
import AuthLoading from './views/AuthLoading';
import { Provider } from "react-redux";
import ProtectedRoute from './views/ProtectedRoute';
import MyProfile from './views/MyProfile';
import BookingHistory from './views/BookingHistory';
import Dashboard from './views/Dashboard';
import CarTypes from './views/CarTypes';
import AddBookings from './views/AddBookings';
import Promos from './views/Promos';
import Riders from './views/Riders';
import Drivers from './views/Drivers';
import FleetAdmins from './views/FleetAdmins';
import Notifications from './views/Notifications';
import DriverEarning from './views/DriverEarning';
import Earningreports from './views/Earningreports';
import Settings from './views/Settings';
import Withdraws from './views/Withdraws';
import CancellationReasons from './views/CancellationReasons';
import RegisterPage from './views/RegisterPage';
import AddMoney from "./views/AddMoney";

import {
  store,
  FirebaseProvider
} from "common";

import { features } from 'config';


var hist = createBrowserHistory();

function App() {
  return (
    <Provider store={store}>
      <FirebaseProvider>
        <AuthLoading>
          <Router history={hist}>
            <Switch>
              <ProtectedRoute exact component={BookingHistory} path="/bookings" permit={"rider,admin,driver,fleetadmin"} />
              <ProtectedRoute exact component={MyProfile} path="/profile" permit={"rider,admin,driver,fleetadmin"} />
              <ProtectedRoute exact component={Dashboard} path="/dashboard" permit={"admin,fleetadmin"} />
              <ProtectedRoute exact component={CarTypes} path="/cartypes" permit={"admin"} />
              <ProtectedRoute exact component={CancellationReasons} path="/cancelreasons" permit={"admin"} />
              <ProtectedRoute exact component={AddBookings} path="/addbookings" permit={"admin"} />
              <ProtectedRoute exact component={Promos} path="/promos" permit={"admin"} />
              <ProtectedRoute exact component={Riders} path="/riders" permit={"admin"} />
              <ProtectedRoute exact component={Drivers} path="/drivers" permit={"admin,fleetadmin"} />
              <ProtectedRoute exact component={FleetAdmins} path="/fleetadmins" permit={"admin"} />
              <ProtectedRoute exact component={DriverEarning} path="/driverearning" permit={"admin,fleetadmin"} />
              <ProtectedRoute exact component={Notifications} path="/notifications" permit={"admin"} />
              <ProtectedRoute exact component={Earningreports} path="/earningreports" permit={"admin"} />
              <ProtectedRoute exact component={AddMoney} path="/addtowallet" permit={"admin"} />
              <ProtectedRoute exact component={Withdraws} path="/withdraws" permit={"admin"} />
              <ProtectedRoute exact component={Settings} path="/settings" permit={"admin"} />
              <Route path="/about-us" component={AboutUs} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              {features.WebsitePagesEnabled ?
                <Route path="/register" component={RegisterPage} />
                : null}
              {features.WebsitePagesEnabled ?
                <Route path="/login" component={LoginPage} />
                : null}
              {features.WebsitePagesEnabled ?
                <Route path="/" component={LandingPage} />
                :
                <Route path="/" component={LoginPage} />
              }
            </Switch>
          </Router>
        </AuthLoading>
      </FirebaseProvider>
    </Provider>
  );
}

export default App;
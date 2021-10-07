import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
//import logger from "redux-logger";

import { authreducer as auth } from "../reducers/authreducer";
import { cartypesreducer as cartypes } from "../reducers/cartypesreducer";
import { bookingslistreducer as bookinglistdata } from "../reducers/bookingslistreducer";
import { estimatereducer as estimatedata } from "../reducers/estimatereducer";
import { bookingreducer as bookingdata } from "../reducers/bookingreducer";
import { cancelreasonreducer as cancelreasondata } from "../reducers/cancelreasonreducer";
import { promoreducer as promodata } from "../reducers/promoreducer";
import { usersreducer as usersdata } from "../reducers/usersreducer";
import { usersExceptLocationreducer as usersdataExcept } from "../reducers/usersExceptLocationreducer";
import { notificationreducer as notificationdata } from "../reducers/notificationreducer";
import { driverearningreducer as driverearningdata } from '../reducers/driverearningreducer';
import { earningreportsreducer as earningreportsdata } from '../reducers/earningreportsreducer';
import { settingsreducer as settingsdata } from '../reducers/settingsreducer';
import { paymentreducer as paymentmethods } from '../reducers/paymentreducer';
import { tripreducer as tripdata } from '../reducers/tripreducer';
import { tasklistreducer as taskdata } from '../reducers/tasklistreducer';
import { locationreducer as locationdata } from '../reducers/locationreducer';
import { chatreducer as chatdata } from '../reducers/chatreducer';
import { withdrawreducer as withdrawdata } from '../reducers/withdrawreducer';
import { gpsreducer as gpsdata } from '../reducers/gpsreducer';

const reducers = combineReducers({
  auth,
  cartypes,
  bookinglistdata,
  estimatedata,
  bookingdata,
  cancelreasondata,
  promodata,
  usersdata,
  usersdataExcept,
  notificationdata,
  driverearningdata,
  earningreportsdata,
  settingsdata,
  paymentmethods,
  tripdata,
  taskdata,
  locationdata,
  chatdata,
  withdrawdata,
  gpsdata
});

let middleware = [thunk];

export const store = createStore(reducers, {}, applyMiddleware(...middleware));

import {
  FETCH_BOOKINGS,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAILED,
  UPDATE_BOOKING,
  CANCEL_BOOKING
} from "../store/types";
import { store } from '../store/store';
import { fetchBookingLocations } from '../actions/locationactions';
import { RequestPushMsg } from '../other/NotificationFunctions';
import { FareCalculator } from '../other/FareCalculator';
import { GetDistance,GetTripDistance } from '../other/GeoFunctions';
import { fetchAddressfromCoords } from '../other/GoogleAPIFunctions';
import { language, dateStyle } from 'config';

export const fetchBookings = (uid, role) => (dispatch) => (firebase) => {

  const {
    bookingListRef,
  } = firebase;

  dispatch({
    type: FETCH_BOOKINGS,
    payload: null,
  });
  bookingListRef(uid, role).on("value", (snapshot) => {
    if (snapshot.val()) {
      const data = snapshot.val();
      const active = [];
      let tracked = null;
      const bookings = Object.keys(data)
        .map((i) => {
          data[i].id = i;
          let dt = new Date(data[i].tripdate);
          data[i].bookingDate = dt.toLocaleString(dateStyle);
          data[i].pickupAddress = data[i].pickup.add;
          data[i].dropAddress = data[i].drop.add;
          data[i].discount = data[i].discount_amount
            ? data[i].discount_amount
            : 0;
          data[i].cashPaymentAmount = data[i].cashPaymentAmount
            ? data[i].cashPaymentAmount
            : 0;
          data[i].cardPaymentAmount = data[i].cardPaymentAmount
            ? data[i].cardPaymentAmount
            : 0;
          return data[i];
        });
      for (let i = 0; i < bookings.length; i++) {
        if (['NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING', 'PAID'].indexOf(bookings[i].status) != -1) {
          active.push(bookings[i]);
        }
        if ((['ACCEPTED', 'ARRIVED', 'STARTED'].indexOf(bookings[i].status) != -1) && role == 'driver') {
          tracked = bookings[i];
          fetchBookingLocations(tracked.id)(dispatch)(firebase);
        }
      }
      dispatch({
        type: FETCH_BOOKINGS_SUCCESS,
        payload: {
          bookings: bookings.reverse(),
          active: active,
          tracked: tracked
        },
      });
      if (tracked) {
        dispatch({
          type: FETCH_BOOKINGS_SUCCESS,
          payload: null
        });
      }
    } else {
      dispatch({
        type: FETCH_BOOKINGS_FAILED,
        payload: language.no_bookings,
      });
    }
  });
};

export const updateBooking = (booking) => (dispatch) => (firebase) => {

  const {
    auth,
    trackingRef,
    singleBookingRef,
    singleUserRef,
    walletBalRef,
    walletHistoryRef
  } = firebase;

  dispatch({
    type: UPDATE_BOOKING,
    payload: booking,
  });
  if (booking.status == 'ARRIVED') {
    let dt = new Date();
    booking.driver_arrive_time = dt.getTime().toString();
    singleBookingRef(booking.id).update(booking);
    RequestPushMsg(booking.customer_token, language.notification_title, language.driver_near);
  }
  if (booking.status == 'STARTED') {
    let dt = new Date();
    let localString = dt.toLocaleTimeString(dateStyle);
    let timeString = dt.getTime();
    booking.trip_start_time = localString;
    booking.startTime = timeString;
    singleBookingRef(booking.id).update(booking);

    singleUserRef(booking.driver).once('value', snapshot => {
      let profile = snapshot.val();
      trackingRef(booking.id).push({
        at: new Date().getTime(),
        status: 'STARTED',
        lat: profile.location.lat,
        lng: profile.location.lng
      });
    })

    RequestPushMsg(booking.customer_token, language.notification_title, language.driver_journey_msg + booking.id);
  }
  if (booking.status == 'REACHED') {
    let lastLocation = store.getState().locationdata.coords;
    let settings = store.getState().settingsdata.settings;

    trackingRef(booking.id).push({
      at: new Date().getTime(),
      status: 'REACHED',
      lat: lastLocation.lat,
      lng: lastLocation.lng
    });

    trackingRef(booking.id).orderByKey().once('value', async (snapshot)=>{  
      const data = snapshot.val();
      let res = await GetTripDistance(data);
      let distance = settings.convert_to_mile? (res.distance / 1.609344) : res.distance;

      let latlng = lastLocation.lat + ',' + lastLocation.lng;
      fetchAddressfromCoords(latlng).then((address) => {
        let drop = {};
        drop['lat'] = lastLocation.lat;
        drop['lng'] = lastLocation.lng;
        drop['add'] = address;
        singleUserRef(booking.customer).child('savedAddresses').once('value',savedAdd => {
            if(savedAdd.val()){
              let addresses = savedAdd.val();
              let didNotMatch = true; 
              for (let key in addresses) {
                let entry = addresses[key];
                if(GetDistance(entry.lat,entry.lng,drop.lat,drop.lng) < 0.1){
                    didNotMatch = false;
                    break;
                }
              }
              if(didNotMatch){
                singleUserRef(booking.customer).child('savedAddresses').push({
                  description: drop.add,
                  lat: drop.lat,
                  lng: drop.lng
                });
              }  
            }else{
              singleUserRef(booking.customer).child('savedAddresses').push({
                description: drop.add,
                lat: drop.lat,
                lng: drop.lng
              });
            }
        });

        let cars = store.getState().cartypes.cars;
        let rates = {};
        for (var i = 0; i < cars.length; i++) {
          if (cars[i].name == booking.carType) {
            rates = cars[i];
          }
        }
        let end_time = new Date();
        let diff = (end_time.getTime() - parseFloat(booking.startTime)) / 1000;
        let totalTimeTaken = Math.abs(Math.round(diff));
        let fare = FareCalculator(distance, totalTimeTaken, rates);

        booking.drop = drop;
        booking.dropAddress = address;
        booking.trip_cost = fare.grandTotal;
        booking.trip_end_time = end_time.toLocaleTimeString(dateStyle);
        booking.distance = parseFloat(distance).toFixed(2);
        booking.driver_share = fare.totalCost - fare.convenience_fees;
        booking.convenience_fees = fare.convenience_fees;
        booking.tuktuk_fees = fare.tuktuk_fees;
        booking.fleet_manager_fees = fare.fleet_manager_fees;
        booking.insurance_road_fees = fare.insurance_road_fees;
        booking.endTime = end_time.getTime();
        booking.total_trip_time = totalTimeTaken;
        booking.coords = res.coords;
        singleBookingRef(booking.id).update(booking);
        RequestPushMsg(booking.customer_token, language.notification_title, language.driver_completed_ride);
      });
    });
  }
  if (booking.status == 'PENDING') {
    singleBookingRef(booking.id).update(booking);
    singleUserRef(booking.driver).update({ queue: false });
  }
  if (booking.status == 'PAID') {
    singleBookingRef(booking.id).update(booking);
    if(booking.driver == auth.currentUser.uid && (booking.payment_mode == 'cash' || booking.payment_mode == 'wallet')){
      singleUserRef(booking.driver).update({ queue: false });
    }

    singleUserRef(booking.driver).once('value', snapshot => {
      let walletBalance = snapshot.val().walletBalance;
      walletBalance = walletBalance + parseFloat(booking.driver_share);
      if(parseFloat(booking.cashPaymentAmount)>0){
        walletBalance = walletBalance - parseFloat(booking.cashPaymentAmount);
      }
      walletBalRef(booking.driver).set(walletBalance);

      let details = {
        type: 'Credit',
        amount: booking.driver_share,
        date: new Date().toString(),
        txRef: booking.id
      }
      walletHistoryRef(booking.driver).push(details);
      
      if(parseFloat(booking.cashPaymentAmount)>0){
        let details = {
          type: 'Debit',
          amount: booking.cashPaymentAmount,
          date: new Date().toString(),
          txRef: booking.id
        }
        walletHistoryRef(booking.driver).push(details);
      }  
    });

    RequestPushMsg(booking.customer_token, language.notification_title, language.success_payment);
    RequestPushMsg(booking.driver_token, language.notification_title, language.success_payment);
  }
  if (booking.status == 'COMPLETE') {
    singleBookingRef(booking.id).update(booking);
    if (booking.rating) {
      RequestPushMsg(booking.driver_token, language.notification_title, language.received_rating.toString().replace("X", booking.rating.toString()));
      singleUserRef(booking.driver).once('value', snapshot => {
        let profile = snapshot.val();
        let ratings = {};
        if (profile && profile.ratings) {
          ratings = profile.ratings
          let details = ratings.details;
          let sum = 0;
          for (let i = 0; i < details.length; i++) {
            sum = sum + parseFloat(details[i].rate);
          }
          sum = sum + booking.rating;
          ratings.userrating = parseFloat(sum / (details.length + 1)).toFixed(1);
          ratings.details.push({
            user: booking.customer,
            rate: booking.rating
          });
        } else {
          ratings.userrating = booking.rating;
          ratings.details = [];
          ratings.details.push({
            user: booking.customer,
            rate: booking.rating
          });
        }
        singleUserRef(booking.driver).update({ratings: ratings});
      });
    }
  }
};

export const cancelBooking = (data) => (dispatch) => (firebase) => {
  const {
    singleBookingRef,
    singleUserRef,
    requestedDriversRef,
  } = firebase;

  dispatch({
    type: CANCEL_BOOKING,
    payload: data,
  });

  singleBookingRef(data.booking.id).update({
    status: 'CANCELLED',
    reason: data.reason
  }).then(() => {
    if (data.booking.driver && (data.booking.status === 'ACCEPTED' || data.booking.status === 'ARRIVED')) {
      singleUserRef(data.booking.driver).update({ queue: false });
      RequestPushMsg(data.booking.driver_token, language.notification_title, language.booking_cancelled + data.booking.id);
      RequestPushMsg(data.booking.customer_token, language.notification_title, language.booking_cancelled + data.booking.id);
    }
    if (data.booking.status === 'NEW') {
      requestedDriversRef(data.booking.id).remove();
    }
  });
};


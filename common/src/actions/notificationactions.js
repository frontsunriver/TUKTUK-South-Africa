import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILED,
  EDIT_NOTIFICATIONS,
  SEND_NOTIFICATION,
  SEND_NOTIFICATION_SUCCESS,
  SEND_NOTIFICATION_FAILED,
} from "../store/types";

import { store } from "../store/store";
import { language } from 'config';
import { RequestPushMsg } from '../other/NotificationFunctions';

export const fetchNotifications = () => (dispatch) => (firebase) => {

  const {
    notifyRef
  } = firebase;

  dispatch({
    type: FETCH_NOTIFICATIONS,
    payload: null
  });
  notifyRef.on("value", snapshot => {
    if (snapshot.val()) {
      const data = snapshot.val();

      const arr = Object.keys(data).map(i => {
        data[i].id = i
        return data[i]
      });

      dispatch({
        type: FETCH_NOTIFICATIONS_SUCCESS,
        payload: arr
      });
    } else {
      dispatch({
        type: FETCH_NOTIFICATIONS_FAILED,
        payload: "No data available."
      });
    }
  });
};

export const editNotifications = (notifications, method) => (dispatch) => (firebase) => {

  const {
    notifyRef, 
    notifyEditRef
  } = firebase;

  dispatch({
    type: EDIT_NOTIFICATIONS,
    payload: { method, notifications }
  });
  if (method === 'Add') {
    notifyRef.push(notifications);
  } else if (method === 'Delete') {
    notifyEditRef(notifications.id).remove();
  } else {
    notifyEditRef(notifications.id).set(notifications);
  }
}

export const sendNotification = (notification) => (dispatch) => (firebase) => {

  dispatch({
    type: SEND_NOTIFICATION,
    payload: notification
  });

  let users = store.getState().usersdata.users;
  let arr = [];
  for (let i = 0; i < users.length; i++) {
    let usr = users[i];
    let obj = {
      "to": null,
      "title": notification.title,
      "msg": notification.body,
    };
    if (notification.usertype === 'All' && notification.devicetype === 'All') {
      if (usr.pushToken) {
        obj.to = usr.pushToken;
        arr.push(obj);
      }
    } else if (notification.usertype === 'All' && notification.devicetype !== 'All') {
      if (usr.pushToken && usr.userPlatform === notification.devicetype) {
        obj.to = usr.pushToken;
        arr.push(obj);
      }
    } else if (notification.usertype !== 'All' && notification.devicetype === 'All') {
      if (usr.pushToken && usr.usertype === notification.usertype) {
        obj.to = usr.pushToken;
        arr.push(obj);
      }
    } else {
      if (usr.pushToken && usr.usertype === notification.usertype && usr.userPlatform === notification.devicetype) {
        obj.to = usr.pushToken;
        arr.push(obj);
      }
    }
  }

  if (arr.length > 0) {
    for (let x = 0; x < arr.length; x++) {
      RequestPushMsg(arr[x].to,arr[x].title,arr[x].msg)
    }
    dispatch({
      type: SEND_NOTIFICATION_SUCCESS,
      payload: arr
    });
  } else {
    dispatch({
      type: SEND_NOTIFICATION_FAILED,
      payload: language.no_user_match,
    });
  }
}

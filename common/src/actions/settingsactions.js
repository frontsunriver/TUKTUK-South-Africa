import {
  FETCH_SETTINGS,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_FAILED,
  EDIT_SETTINGS,
  CLEAR_SETTINGS_ERROR
} from "../store/types";

import {
  FirebaseConfig,
  language,
  AppDetails,
  mainUrl,
} from 'config';

export const fetchSettings= () => (dispatch) => (firebase) => {

  const {
    settingsRef
  } = firebase;

  dispatch({
    type: FETCH_SETTINGS,
    payload: null,
  });
  settingsRef.on("value", (snapshot) => {
    if (snapshot.val()) {
      dispatch({
        type: FETCH_SETTINGS_SUCCESS,
        payload: snapshot.val(),
      });
    } else {
      dispatch({
        type: FETCH_SETTINGS_FAILED,
        payload: language.settings_error,
      });
    }
  });
};

export const editSettings = (settings) => (dispatch) => (firebase) => {

  const {
    settingsRef
  } = firebase;

  if(settings.license){
    try {
      fetch(`https://us-central1-tuk-tuk-e7419.${mainUrl}/baseset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license: settings.license?settings.license: ' ',
          contact_email: settings.license?settings.contact_email: ' ',
          app_name: AppDetails.app_name,
          app_identifier: AppDetails.app_identifier,
          projectId: FirebaseConfig.projectId,
          createTime: new Date().toISOString(),
          reqType: 'settings'
        })
      }).then(response => response.json())
        .then((res) => {
          if (res.success) {
            dispatch({
              type: EDIT_SETTINGS,
              payload: settings
            });
            settingsRef.set(settings);
            alert(language.updated);
          }else{
            alert(language.wrong_code);
          }
        }).catch(error=>{
          console.log(error);
        })
    } catch (error) {
      console.log(error);
    }
  }else{
    dispatch({
      type: EDIT_SETTINGS,
      payload: settings
    });
    settingsRef.set(settings);
    alert(language.updated);
  }
};

export const clearSettingsViewError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_SETTINGS_ERROR,
    payload: null
  });
};
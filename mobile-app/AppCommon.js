import { useState, useContext, useEffect, useRef } from 'react';
import { store, FirebaseContext } from 'common/src';
import { useSelector, useDispatch } from 'react-redux';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import { language } from 'config';
import { colors } from './src/common/theme';
import GetPushToken from './src/components/GetPushToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    console.log("Task Error");
    return;
  }
  if (locations.length > 0) {
    let location = locations[locations.length - 1];
    try {
      if (store.getState().auth.info && store.getState().auth.info.uid) {
        store.dispatch({
          type: 'UPDATE_GPS_LOCATION',
          payload: {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

export default function AppCommon({ children }) {
  const { api } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const gps = useSelector(state => state.gpsdata);
  const activeBooking = useSelector(state => state.bookinglistdata.tracked);
  const lastLocation = useSelector(state => state.locationdata.coords);
  const auth = useSelector(state => state.auth);
  const tasks = useSelector(state => state.taskdata.tasks);
  const settings = useSelector(state => state.settingsdata.settings);
  const watcher = useRef();
  const tokenFetched = useRef();
  const locationOn = useRef();
  const [sound, setSound] = useState();

  useEffect(() => {
    if (auth.info && auth.info.profile && auth.info.profile.usertype == 'driver' && tasks && tasks.length > 0) {
      playSound();
    }
    if (auth.info && auth.info.profile && auth.info.profile.usertype == 'driver' && (!tasks || tasks.length == 0)) {
      stopPlaying();
    }
  }, [auth.info,tasks]);

  useEffect(()=>{
    if(settings){
      loadSound();
    }
  },[settings]);

  const loadSound = async () => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      useNativeControls: false
    });
  
    const { sound } = await Audio.Sound.createAsync(settings.CarHornRepeat?require('./assets/sounds/car_horn_gap.wav'):require('./assets/sounds/car_horn.wav'));
    sound.setIsLoopingAsync(settings.CarHornRepeat);
    setSound(sound);
  }

  const playSound = async () => {
    sound.playAsync();
  }

  const stopPlaying = async () => {
    if(sound){
      sound.stopAsync();
    }
  }

  useEffect(() => {;
    tokenFetched.current = false;
    locationOn.current = false;
  }, []);

  useEffect(() => {
    if (gps.location) {
      if (auth.info && auth.info.uid) {
        api.saveUserLocation(auth.info.uid, {
          lat: gps.location.lat,
          lng: gps.location.lng
        });
      }
      if (activeBooking && auth.info.profile.usertype == 'driver') {
        if (lastLocation && (activeBooking.status == 'ACCEPTED' || activeBooking.status == 'STARTED')) {
          let diff = api.GetDistance(lastLocation.lat, lastLocation.lng, gps.location.lat, gps.location.lng);
          if (diff > 0.010) {
            api.saveTracking(activeBooking.id, {
              at: new Date().getTime(),
              status: activeBooking.status,
              lat: gps.location.lat,
              lng: gps.location.lng
            });
          }
        }
        if (activeBooking.status == 'ACCEPTED') {
          let diff = api.GetDistance(activeBooking.pickup.lat, activeBooking.pickup.lng, gps.location.lat, gps.location.lng);
          if (diff < 0.02) {
            let bookingData = activeBooking;
            bookingData.status = 'ARRIVED';
            store.dispatch(api.updateBooking(bookingData));
            api.saveTracking(activeBooking.id, {
              at: new Date().getTime(),
              status: 'ARRIVED',
              lat: gps.location.lat,
              lng: gps.location.lng
            });
          }
        }
      }
    }
  }, [gps.location]);

  useEffect(() => {
    if (auth.info
      && auth.info.profile
      && auth.info.profile.usertype == 'driver'
      && auth.info.profile.driverActiveStatus
      && auth.info.profile.approved
    ) {
      if (!locationOn.current) {
        locationOn.current = true;
        if(Platform.OS == 'android'){
          AsyncStorage.getItem('firstRun', (err, result) => {
            if(result){
              StartBackgroundLocation();
            }else{
              Alert.alert(
                language.disclaimer,
                language.disclaimer_text,
                [
                  { 
                    text: language.ok, onPress: () => {
                      AsyncStorage.setItem('firstRun', 'OK');
                      StartBackgroundLocation();
                    }
                  }
                ],
                { cancelable: false }
              );
            }
          });
        }else{
          StartBackgroundLocation();
        }
      }else{
        // locationOn.current = true;
        // if(Platform.OS == 'android'){
        //   AsyncStorage.getItem('firstRun', (err, result) => {
        //     if(result){
        //       StartBackgroundLocation();
        //     }else{
        //       Alert.alert(
        //         language.disclaimer,
        //         language.disclaimer_text,
        //         [
        //           { 
        //             text: language.ok, onPress: () => {
        //               AsyncStorage.setItem('firstRun', 'OK');
        //               StartBackgroundLocation();
        //             }
        //           }
        //         ],
        //         { cancelable: false }
        //       );
        //     }
        //   });
        // }else{
        //   StartBackgroundLocation();
        // }
      }
    }
    if (auth.info
      && auth.info.profile
      && auth.info.profile.usertype == 'driver'
      && auth.info.profile.driverActiveStatus == false
      && auth.info.profile.approved
    ) {
      if (locationOn.current) {
        locationOn.current = false;
        StopBackgroundLocation();
      }
    }
    if (auth.info
      && auth.info.profile
      && auth.info.profile.usertype == 'rider'
      && auth.info.profile.approved
    ) {
      if (!locationOn.current) {
        locationOn.current = true;
        if(Platform.OS == 'android'){
          AsyncStorage.getItem('firstRun', (err, result) => {
            if(result){
              GetOneTimeLocation();
            }else{
              Alert.alert(
                language.disclaimer,
                language.disclaimer_text,
                [
                  { 
                    text: language.ok, onPress: () => {
                      AsyncStorage.setItem('firstRun', 'OK');
                      GetOneTimeLocation();
                    }
                  }
                ],
                { cancelable: false }
              );
            }
          });
        }else{
          GetOneTimeLocation();
        }
      }
    }
    if (auth.info
      && auth.info.profile
      && auth.info.profile.approved
      && (auth.info.profile.usertype == 'rider' || auth.info.profile.usertype == 'driver')) {
      if (!tokenFetched.current) {
        tokenFetched.current = true;
        saveToken();
      }
    }
  }, [auth.info]);

  const saveToken = async () => {
    let token = await GetPushToken();
    dispatch(
      api.updatePushToken(
        auth.info,
        token?token:'token_error',
        Platform.OS == 'ios' ? 'IOS' : 'ANDROID'
      )
    );
  };

  const GetOneTimeLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status === 'granted') {
      try {
        let location = await Location.getCurrentPositionAsync({});
        if (location) {
          store.dispatch({
            type: 'UPDATE_GPS_LOCATION',
            payload: {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            }
          });
        }
      } catch (error) {
        Alert.alert(language.alert, language.location_permission_error)
      }
    } else {
      Alert.alert(language.alert, language.location_permission_error)
    }
  }

  const StartBackgroundLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      try {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          showsBackgroundLocationIndicator: true,
          activityType: Location.ActivityType.AutomotiveNavigation,
          foregroundService: {
            notificationTitle: language.locationServiveTitle,
            notificationBody: language.locationServiveBody,
            notificationColor: colors.SKY
          }
        });
      } catch (error) {
        StartForegroundGeolocation();
      }
    } else {
      Alert.alert(language.alert, language.location_permission_error)
    }
  }

  const StartForegroundGeolocation = async () => {
    watcher.current = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      activityType: Location.ActivityType.AutomotiveNavigation,
    }, location => {
      store.dispatch({
        type: 'UPDATE_GPS_LOCATION',
        payload: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
      });
    });
  }

  const StopBackgroundLocation = async () => {
    locationOn.current = false;
    try {
      TaskManager.getRegisteredTasksAsync().then((res) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].taskName == LOCATION_TASK_NAME) {
              Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
              break;
            }
          }
        } else {
          if (watcher.current) {
            watcher.current.remove();
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (api) {
      dispatch(api.fetchUser());
      dispatch(api.fetchCarTypes());
      dispatch(api.fetchSettings());
    }
  }, [api]);

  return children;
}
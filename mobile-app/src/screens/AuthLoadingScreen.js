import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { language } from 'config';
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from 'common/src';

export default function AuthLoadingScreen(props) {
  const { api } = useContext(FirebaseContext);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.info) {
      if (auth.info.profile) {
        let role = auth.info.profile.usertype;
        if (auth.info.profile.approved) {
          if (role === 'rider') {
            dispatch(api.fetchDrivers());
            dispatch(api.fetchBookings(auth.info.uid, role));
            dispatch(api.fetchCancelReasons());
            dispatch(api.fetchPaymentMethods());
            dispatch(api.fetchPromos());
            props.navigation.navigate('RiderRoot');
          } else if (role === 'driver') {
            dispatch(api.monitorProfileChanges());
            dispatch(api.fetchBookings(auth.info.uid, role));
            dispatch(api.fetchPaymentMethods());
            dispatch(api.fetchTasks());
            props.navigation.navigate('DriverRoot');
          } else if (role === 'admin' || role == 'fleetadmin') {
            props.navigation.navigate('AdminRoot');
          }
          else {
            Alert.alert(language.alert, language.not_valid_user_type);
            dispatch(api.signOut());
            props.navigation.navigate('Intro');
          }
        }
        else {
          Alert.alert(language.alert, language.require_approval);
          dispatch(api.signOut());
          props.navigation.navigate('Intro');
        }
      }else{
        Alert.alert(language.alert, language.user_issue_contact_admin);
        dispatch(api.signOut());
        props.navigation.navigate('Intro');
      }
    }
  }, [auth.info]);

  useEffect(() => {
    if (api && auth.error && auth.error.msg && !auth.info) {
      dispatch(api.clearLoginError());
      props.navigation.navigate('Intro');
    }
  }, [auth.error,auth.error.msg]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/intro.jpg')}
        resizeMode="stretch"
        style={styles.imagebg}
      >
        <ActivityIndicator />
        <Text style={{ paddingBottom: 100 }}>{language.fetching_data}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  imagebg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: "flex-end",
    alignItems: 'center'
  }
});
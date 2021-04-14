import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
    Platform,
    Modal,
    TouchableWithoutFeedback,
    Linking,
    Alert,
    ImageBackground
} from 'react-native';
import { Icon, Button, Header } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import { OtpModal } from '../components';
import StarRating from 'react-native-star-rating';
import RadioForm from 'react-native-simple-radio-button';
import { colors } from '../common/theme';
var { width, height } = Dimensions.get('window');
import { language } from 'config';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import Polyline from '@mapbox/polyline';
import getDirections from 'react-native-google-maps-directions';
import carImageIcon from '../../assets/images/track_Car.png';
import { FirebaseContext } from 'common/src';

export default function BookedCabScreen(props) {
    const { api } = useContext(FirebaseContext);
    const {
        fetchBookingLocations,
        stopLocationFetch,
        cancelBooking,
        updateBooking,
        getRouteDetails   
    } = api;
    const dispatch = useDispatch();
    const bookingId = props.navigation.getParam('bookingId');
    const latitudeDelta = 0.9922;
    const longitudeDelta = 1.9421;
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const activeBookings = useSelector(state => state.bookinglistdata.active);
    const [curBooking, setCurBooking] = useState(null);
    const cancelReasons = useSelector(state => state.cancelreasondata.complex);
    const role = useSelector(state => state.auth.info.profile.usertype);
    const [cancelReasonSelected, setCancelReasonSelected] = useState(null);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const lastLocation = useSelector(state => state.locationdata.coords);
    const [liveRouteCoords, setLiveRouteCoords] = useState(null);
    const mapRef = useRef();
    const pageActive = useRef(false);
    const [lastCoords,setlastCoords] = useState();
    const [arrivalTime, setArrivalTime] = useState(0);


    useEffect(() => {
        setInterval(() => {
            if(pageActive.current && curBooking && lastLocation && (curBooking.status == 'ACCEPTED' || curBooking.status == 'STARTED')){
                if(lastCoords && lastCoords.lat!=lastLocation.lat && lastCoords.lat!=lastLocation.lng){
                    if(curBooking.status == 'ACCEPTED'){
                        let point1 = { lat : lastLocation.lat, lng: lastLocation.lng};
                        let point2 = { lat : curBooking.pickup.lat, lng: curBooking.pickup.lng};
                        fitMap(point1,point2);
                    }else{
                        let point1 = { lat : lastLocation.lat, lng: lastLocation.lng};
                        let point2 = { lat : curBooking.drop.lat, lng: curBooking.drop.lng};
                        fitMap(point1,point2);
                    }
                    setlastCoords(lastLocation);
                }
            }
        }, 20000);
    }, []);

    useEffect(()=>{
        if(lastLocation && curBooking && curBooking.status == 'ACCEPTED'){
            let point1 = { lat : lastLocation.lat, lng: lastLocation.lng};
            let point2 = { lat : curBooking.pickup.lat, lng: curBooking.pickup.lng};
            fitMap(point1,point2);
            setlastCoords(lastLocation);
        }

        if(curBooking && curBooking.status == 'ARRIVED'){
            setlastCoords(null);
            setTimeout(()=>{
                mapRef.current.fitToCoordinates([{ latitude: curBooking.pickup.lat, longitude: curBooking.pickup.lng }, { latitude: curBooking.drop.lat , longitude: curBooking.drop.lng }], {
                    edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                    animated: true,
                })
            },1000);
        }
        if(lastLocation && curBooking && curBooking.status == 'STARTED'){
            let point1 = { lat : lastLocation.lat, lng: lastLocation.lng};
            let point2 = { lat : curBooking.drop.lat, lng: curBooking.drop.lng};
            fitMap(point1,point2);
            setlastCoords(lastLocation);
        }
        if(lastLocation && curBooking && curBooking.status == 'REACHED' && role=='rider'){
            setTimeout(()=>{
                mapRef.current.fitToCoordinates([{ latitude: curBooking.pickup.lat, longitude: curBooking.pickup.lng }, { latitude: lastLocation.lat , longitude:  lastLocation.lng }], {
                    edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                    animated: true,
                })
            },1000);
        }
    },[lastLocation,curBooking])

    const fitMap = (point1, point2) => {
        let startLoc = '"' + point1.lat + ',' + point1.lng + '"';
        let destLoc = '"' + point2.lat + ',' + point2.lng + '"';
        getRouteDetails(startLoc, destLoc).then((details) => {
            setArrivalTime(details.duration? parseFloat(details.duration/60).toFixed(0): 0);
            let points = Polyline.decode(details.polylinePoints);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            setLiveRouteCoords(coords);
            mapRef.current.fitToCoordinates([{ latitude: point1.lat, longitude: point1.lng }, { latitude: point2.lat, longitude: point2.lng }], {
                edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                animated: true,
            })
        });
    }


    useEffect(() => {

        if (activeBookings && activeBookings.length >= 1) {
            let booking = activeBookings.filter(booking => booking.id == bookingId)[0];
            if(booking){
                setCurBooking(booking);
                if (booking.status == 'NEW') {
                    if( role == 'rider') setSearchModalVisible(true);
                }
                if (booking.status == 'ACCEPTED') {
                    if( role == 'rider') setSearchModalVisible(false);
                    if( role == 'rider') dispatch(fetchBookingLocations(bookingId));
                }
                if (booking.status == 'ARRIVED') {
                    if( role == 'rider') dispatch(fetchBookingLocations(bookingId));
                }
                if (booking.status == 'STARTED') {
                    if( role == 'rider') dispatch(fetchBookingLocations(bookingId));
                }
                if (booking.status == 'REACHED') {
                    if( role == 'rider') dispatch(stopLocationFetch(bookingId));
                    if( role == 'driver') props.navigation.navigate('PaymentDetails', { booking: booking });
                }
                if (booking.status == 'PENDING') {
                    if( role == 'rider') props.navigation.navigate('PaymentDetails', { booking: booking });
                }
                if (booking.status == 'PAID') {
                    if( role == 'rider') props.navigation.navigate('DriverRating', { booking: booking });
                }        
            }
            else{
                setModalVisible(false);
                setSearchModalVisible(false);
                props.navigation.navigate('RideList');
            }
        }
        else {
            setModalVisible(false);
            setSearchModalVisible(false);
            if (role == 'driver') {
                props.navigation.navigate('DriverTrips');
            } else {
                props.navigation.navigate('RideList');
            }
        }
    }, [activeBookings]);

    const renderButtons = () => {
        return (
            (curBooking && role == 'rider' && (curBooking.status == 'NEW' || curBooking.status == 'ACCEPTED')) ||
                (curBooking && role == 'driver' && (curBooking.status == 'ACCEPTED' || curBooking.status == 'ARRIVED' || curBooking.status == 'STARTED')) ?
                <View style={{ flex: 1.5, flexDirection: 'row' }}>
                    {(role == 'rider' && (curBooking.status == 'NEW' || curBooking.status == 'ACCEPTED')) ||
                        (role == 'driver' && (curBooking.status == 'ACCEPTED' || curBooking.status == 'ARRIVED')) ?
                        <View style={{ flex: 1 }}>
                            <Button
                                title={language.cancel_ride}
                                loading={false}
                                loadingProps={{ size: "large", color: colors.BLUE.default }}
                                titleStyle={{ color: colors.WHITE, fontWeight: 'bold' }}
                                onPress={() => {
                                    role == 'rider' ?
                                        setModalVisible(true) :
                                        Alert.alert(
                                            language.alert,
                                            language.cancel_confirm,
                                            [
                                                { text: language.cancel, onPress: () => console.log('NO Pressed'), style: 'cancel' },
                                                { text: language.ok, onPress: () => dispatch(cancelBooking({ booking: curBooking, reason: language.driver_cancelled_booking })) },
                                            ]
                                        );
                                }
                                }
                                buttonStyle={{ height: '100%', backgroundColor: colors.GREY.secondary }}
                                containerStyle={{ height: '100%' }}
                            />
                        </View>
                        : null}
                    {role == 'driver' && (curBooking.status == 'ACCEPTED' || curBooking.status == 'ARRIVED') ?
                        <View style={styles.buttonContainer}>
                            <Button
                                title={language.start_trip}
                                loading={false}
                                loadingProps={{ size: "large", color: colors.BLUE.default }}
                                titleStyle={{ color: colors.WHITE, fontWeight: 'bold' }}
                                onPress={() => {
                                    if (curBooking.otp) {
                                        setOtpModalVisible(true);
                                    } else {
                                        startBooking();
                                    }
                                }}
                                buttonStyle={{ height: '100%', backgroundColor: colors.GREEN.bright }}
                                containerStyle={{ height: '100%' }}
                            />
                        </View>
                        : null}
                    {role == 'driver' && curBooking.status == 'STARTED' ?
                        <View style={styles.buttonContainer}>
                            <Button
                                title={language.complete_ride}
                                loading={false}
                                loadingProps={{ size: "large", color: colors.BLUE.default }}
                                titleStyle={{ color: colors.WHITE, fontWeight: 'bold' }}
                                onPress={() => endBooking()}
                                buttonStyle={{ height: '100%', backgroundColor: colors.LIGHT_RED }}
                                containerStyle={{ height: '100%' }}
                            />
                        </View>
                        : null}
                </View>
                : null
        );
    }

    const startBooking = () => {
        setOtpModalVisible(false);
        let booking = { ...curBooking };
        booking.status = 'STARTED';
        dispatch(updateBooking(booking));
    }

    const endBooking = () => {
        let booking = { ...curBooking };
        booking.status = 'REACHED';
        dispatch(updateBooking(booking));
    }

    const startNavigation = () => {
        const params = [
            {
                key: "travelmode",
                value: "driving"
            },
            {
                key: "dir_action",
                value: "navigate"
            }
        ];
        let data = null;
        try {
            if (curBooking.status == 'ACCEPTED') {
                data = {
                    source: {
                        latitude: lastLocation.lat,
                        longitude: lastLocation.lng
                    },
                    destination: {
                        latitude: curBooking.pickup.lat,
                        longitude: curBooking.pickup.lng
                    },
                    params: params,
                }
            }
            if (curBooking.status == 'STARTED') {
                data = {
                    source: {
                        latitude: lastLocation.lat,
                        longitude: lastLocation.lng
                    },
                    destination: {
                        latitude: curBooking.drop.lat,
                        longitude: curBooking.drop.lng
                    },
                    params: params,
                }
            }

            if (data && data.source.latitude) {
                getDirections(data);
            } else {
                Alert.alert(language.alert, language.navigation_available);
            }


        } catch (error) {
            console.log(error);
            Alert.alert(language.alert, language.location_error);
        }

    }

    //ride cancel confirm modal design
    const alertModal = () => {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={alertModalVisible}
                onRequestClose={() => {
                    setAlertModalVisible(false);
                }}>
                <View style={styles.alertModalContainer}>
                    <View style={styles.alertModalInnerContainer}>

                        <View style={styles.alertContainer}>

                            <Text style={styles.rideCancelText}>{language.rider_cancel_text}</Text>

                            <View style={styles.horizontalLLine} />

                            <View style={styles.msgContainer}>
                                <Text style={styles.cancelMsgText}>{language.cancel_messege1}  {bookingId} {language.cancel_messege2} </Text>
                            </View>
                            <View style={styles.okButtonContainer}>
                                <Button
                                    title={language.no_driver_found_alert_OK_button}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => {
                                        setAlertModalVisible(false);
                                        props.navigation.popToTop();
                                    }}
                                    buttonStyle={styles.okButtonStyle}
                                    containerStyle={styles.okButtonContainerStyle}
                                />
                            </View>

                        </View>

                    </View>
                </View>

            </Modal>
        )
    }

    //caacel modal design
    const cancelModal = () => {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={styles.cancelModalContainer}>
                    <View style={styles.cancelModalInnerContainer}>

                        <View style={styles.cancelContainer}>
                            <View style={styles.cancelReasonContainer}>
                                <Text style={styles.cancelReasonText}>{language.cancel_reason_modal_title}</Text>
                            </View>

                            <View style={styles.radioContainer}>
                                <RadioForm
                                    radio_props={cancelReasons}
                                    initial={0}
                                    animation={false}
                                    buttonColor={colors.GREY.secondary}
                                    selectedButtonColor={colors.GREY.secondary}
                                    buttonSize={10}
                                    buttonOuterSize={20}
                                    style={styles.radioContainerStyle}
                                    labelStyle={styles.radioText}
                                    radioStyle={styles.radioStyle}
                                    onPress={(value) => { setCancelReasonSelected(value) }}
                                />
                            </View>
                            <View style={styles.cancelModalButtosContainer}>
                                <Button
                                    title={language.dont_cancel_text}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => { setModalVisible(false) }}
                                    buttonStyle={styles.cancelModalButttonStyle}
                                    containerStyle={styles.cancelModalButtonContainerStyle}
                                />

                                <View style={styles.buttonSeparataor} />

                                <Button
                                    title={language.no_driver_found_alert_OK_button}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => {
                                        if (cancelReasonSelected>=0) {
                                            dispatch(cancelBooking({ booking: curBooking, reason: cancelReasons[cancelReasonSelected].label }));
                                        } else {
                                            Alert.alert(language.alert, language.select_reason);
                                        }
                                    }}
                                    buttonStyle={styles.cancelModalButttonStyle}
                                    containerStyle={styles.cancelModalButtonContainerStyle}
                                />
                            </View>

                        </View>


                    </View>
                </View>

            </Modal>
        )
    }


    const searchModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={searchModalVisible}
                onRequestClose={() => {
                    setSearchModalVisible(false)
                }}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%', backgroundColor: colors.WHITE, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flex: 1, maxHeight: 310 }}>
                        <View style={{ marginTop: 15 }}>
                            <Image source={require('../../assets/images/lodingDriver.gif')} resizeMode={'contain'} style={{ width: 160, height: 160, marginTop: 15 }} />
                            <View><Text style={{ color: colors.BLUE.default.primary, fontSize: 16, marginTop: 12 }}>{language.driver_assign_messege}</Text></View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title={language.close}
                                    loading={false}
                                    loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                                    titleStyle={styles.buttonTitleText}
                                    onPress={() => { setSearchModalVisible(false) }}
                                    buttonStyle={styles.cancelButtonStyle}
                                    containerStyle={{ marginTop: 30 }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    const chat = () => {
        props.navigation.navigate("onlineChat", { bookingId: bookingId })
    }

    const onPressCall = (phoneNumber) => {
        let call_link = Platform.OS == 'android' ? 'tel:' + phoneNumber : 'telprompt:' + phoneNumber;
        Linking.canOpenURL(call_link).then(supported => {
            if (supported) {
                return Linking.openURL(call_link);
            } else {
                console.log("Unable to call");
            }
        }).catch(err => console.error('An error occurred', err));
    }

    return (
        <View style={styles.mainContainer}>
            <NavigationEvents
                onWillBlur={payload => {
                    pageActive.current = false;
                    if (role == 'rider') {
                        dispatch(stopLocationFetch(bookingId));
                    }
                }}
                onDidFocus={payload => {
                    pageActive.current = true;
                }}
            />
            <Header
                backgroundColor={colors.GREY.default}
                leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { props.navigation.toggleDrawer(); } }}
                centerComponent={<Text style={styles.headerTitleStyle}>{language.booked_cab_title}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.headerInnerStyle}
            />

            <View style={styles.topContainer}>
                <View style={styles.topLeftContainer}>
                    <View style={styles.circle} />
                    <View style={styles.staightLine} />
                    <View style={styles.square} />
                </View>
                <View style={styles.topRightContainer}>
                    <TouchableOpacity style={styles.whereButton}>
                        <View style={styles.whereContainer}>
                            <Text numberOfLines={1} style={styles.whereText}>{curBooking ? curBooking.pickup.add : ""}</Text>
                            <Icon
                                name='gps-fixed'
                                color={colors.WHITE}
                                size={23}
                                containerStyle={styles.iconContainer}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropButton}>
                        <View style={styles.whereContainer}>
                            <Text numberOfLines={1} style={styles.whereText}>{curBooking ? curBooking.drop.add : ""}</Text>
                            <Icon
                                name='search'
                                type='feather'
                                color={colors.WHITE}
                                size={23}
                                containerStyle={styles.iconContainer}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mapcontainer}>
                {curBooking ?
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: curBooking.pickup.lat,
                            longitude: curBooking.pickup.lng,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: longitudeDelta
                        }}
                    >

                        {( curBooking.status == 'ACCEPTED' || curBooking.status == 'ARRIVED' || curBooking.status == 'STARTED' ) && lastLocation ?
                            <Marker.Animated
                                coordinate={new AnimatedRegion({
                                    latitude: lastLocation.lat,
                                    longitude: lastLocation.lng,
                                    latitudeDelta: latitudeDelta,
                                    longitudeDelta: longitudeDelta
                                })}
                            >
                                <Image
                                    source={carImageIcon}
                                    style={{ height: 40, width: 40 }}
                                />
                            </Marker.Animated>
                        :null}

                        <Marker
                            coordinate={{ latitude: (curBooking.pickup.lat), longitude: (curBooking.pickup.lng) }}
                            title={curBooking.pickup.add}
                            pinColor={colors.GREEN.default}
                        />
                        <Marker
                            coordinate={{ latitude: (curBooking.drop.lat), longitude: (curBooking.drop.lng) }}
                            title={curBooking.drop.add}
                        />
           
                        {liveRouteCoords &&  (curBooking.status == 'ACCEPTED' || curBooking.status == 'STARTED')?
                            <MapView.Polyline 
                                coordinates={liveRouteCoords} 
                                strokeWidth={5} 
                                strokeColor={colors.BLUE.default}
                            />
                        : null}

                        {curBooking.status == 'ARRIVED' || curBooking.status == 'REACHED'?
                            <MapView.Polyline
                                coordinates={curBooking.coords}
                                strokeWidth={4}
                                strokeColor={colors.BLUE.default}
                            />
                        : null}
                    </MapView>
                    : null}
                <TouchableOpacity
                    style={styles.floatButtonStyle}
                    onPress={() => chat()}
                >
                    <Icon
                        name="ios-chatbubbles"
                        type="ionicon"
                        size={30}
                        color={colors.WHITE}
                    />
                </TouchableOpacity>
                {role == 'driver' ?
                    <TouchableOpacity
                        style={styles.navigateFloatingButton}
                        onPress={() =>
                            startNavigation()
                        }
                    >
                        <Icon
                            name="ios-navigate"
                            type="ionicon"
                            size={30}
                            color={colors.WHITE}
                        />
                    </TouchableOpacity>
                    : null}
                <TouchableOpacity
                    style={styles.CallfloatButtonStyle}
                    onPress={() =>
                        role == 'rider' ? onPressCall(curBooking.driver_contact) : onPressCall(curBooking.customer_contact)
                    }
                >
                    <Icon
                        name="ios-call"
                        type="ionicon"
                        size={30}
                        color={colors.WHITE}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>

                <View style={styles.otpContainer}>
                    <Text style={styles.cabText}>{language.booking_status}: <Text style={styles.cabBoldText}>{curBooking && curBooking.status? language[curBooking.status] : null} {curBooking && curBooking.status=='ACCEPTED'? '( ' +  arrivalTime + ' ' + language.mins + ' )' : ''}</Text></Text>
                    {role=='rider' ?<Text style={styles.otpText}>{curBooking ? language.otp + curBooking.otp : null}</Text>: null}

                </View>
                <View style={styles.cabDetailsContainer}>
                    {curBooking && curBooking.status == "NEW" ?
                        <ImageBackground source={require('../../assets/images/car-moving.gif')} resizeMode='stretch'
                            style={{ flex: 1, width: width, height: undefined, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 14, marginBottom: 20 }}>{language.searching}</Text>
                            <Image style={{ width: 36, height: 36, marginBottom: 20, marginRight: 10 }} source={require('../../assets/images/loader.gif')} />
                        </ImageBackground>
                        : null}
                    {curBooking && curBooking.status != "NEW" ?
                        <View style={styles.cabDetails}>
                            <View style={styles.cabName}>
                                <Text style={styles.cabNameText}>{curBooking.carType}</Text>
                            </View>

                            <View style={styles.cabPhoto}>
                                <Image source={{ uri: curBooking.carImage }} resizeMode={'contain'} style={styles.cabImage} />
                            </View>

                            <View style={styles.cabNumber}>
                                <Text style={styles.cabNumberText}>{curBooking.vehicle_number}</Text>
                            </View>

                        </View>
                        : null}
                    {curBooking && curBooking.status != "NEW" ?
                        <View style={styles.verticalDesign}>
                            <View style={styles.triangle} />
                            <View style={styles.verticalLine} />
                        </View>
                        : null}
                    {curBooking && curBooking.status != "NEW" ?
                        <View style={styles.driverDetails}>
                            <View style={styles.driverPhotoContainer}>
                                {role == 'rider'?
                                <Image source={curBooking.driver_image ? { uri: curBooking.driver_image } : require('../../assets/images/profilePic.png')} style={styles.driverPhoto} />
                                :
                                <Image source={curBooking.customer_image ? { uri: curBooking.customer_image } : require('../../assets/images/profilePic.png')} style={styles.driverPhoto} />
                                }
                            </View>
                            <View style={styles.driverNameContainer}>
                                {role == 'rider'?
                                <Text style={styles.driverNameText}>{curBooking.driver_name}</Text>
                                :
                                <Text style={styles.driverNameText}>{curBooking.customer_name}</Text>
                                }
                            </View>
                           
                            <View style={styles.ratingContainer}>
                                {role == 'rider'?
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    starSize={height / 42}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    emptyStar={'ios-star-outline'}
                                    iconSet={'Ionicons'}
                                    fullStarColor={colors.YELLOW.primary}
                                    emptyStarColor={colors.YELLOW.primary}
                                    halfStarColor={colors.YELLOW.primary}
                                    rating={parseInt(curBooking.driverRating)}
                                    containerStyle={styles.ratingContainerStyle}
                                />
                                :null}
                            </View>
                            
                        </View>
                        : null}
                </View>
                {
                    renderButtons()
                }
            </View>
            {
                cancelModal()
            }
            {
                alertModal()
            }
            {
                searchModal()
            }
            <OtpModal
                modalvisable={otpModalVisible}
                requestmodalclose={() => { setOtpModalVisible(false) }}
                otp={curBooking ? curBooking.otp : ''}
                onMatch={(value) => value ? startBooking() : null}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.WHITE, },
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0,
    },
    headerInnerStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    topContainer: { flex: 1.5, flexDirection: 'row', borderTopWidth: 0, alignItems: 'center', backgroundColor: colors.GREY.default, paddingEnd: 20 },
    topLeftContainer: {
        flex: 1.5,
        alignItems: 'center'
    },
    topRightContainer: {
        flex: 9.5,
        justifyContent: 'space-between',
    },
    circle: {
        height: 15,
        width: 15,
        borderRadius: 15 / 2,
        backgroundColor: colors.YELLOW.light
    },
    staightLine: {
        height: height / 25,
        width: 1,
        backgroundColor: colors.YELLOW.light
    },
    square: {
        height: 17,
        width: 17,
        backgroundColor: colors.GREY.iconPrimary
    },
    whereButton: { flex: 1, justifyContent: 'center', borderBottomColor: colors.WHITE, borderBottomWidth: 1 },
    whereContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    whereText: { flex: 9, fontFamily: 'Roboto-Regular', fontSize: 14, fontWeight: '400', color: colors.WHITE },
    iconContainer: { flex: 1 },
    dropButton: { flex: 1, justifyContent: 'center' },
    mapcontainer: {
        flex: 7,
        width: width
    },
    bottomContainer: { flex: 2.5, alignItems: 'center' },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    otpContainer: { flex: 0.8, backgroundColor: colors.YELLOW.secondary, width: width, flexDirection: 'row', justifyContent: 'space-between' },
    cabText: { paddingLeft: 10, alignSelf: 'center', color: colors.BLACK, fontFamily: 'Roboto-Regular' },
    cabBoldText: { fontFamily: 'Roboto-Bold' },
    otpText: { paddingRight: 10, alignSelf: 'center', color: colors.BLACK, fontFamily: 'Roboto-Bold' },
    cabDetailsContainer: { flex: 2.5, backgroundColor: colors.WHITE, flexDirection: 'row', position: 'relative', zIndex: 1 },
    cabDetails: { flex: 19 },
    cabName: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    cabNameText: { color: colors.GREY.btnPrimary, fontFamily: 'Roboto-Bold', fontSize: 13 },
    cabPhoto: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cabImage: { width: 150, height: height / 16, marginBottom: 5, marginTop: 5 },
    cabNumber: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cabNumberText: { color: colors.GREY.iconSecondary, fontFamily: 'Roboto-Bold', fontSize: 13 },
    verticalDesign: { flex: 2, height: 50, width: 1, alignItems: 'center' },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: colors.TRANSPARENT,
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 10,
        borderLeftColor: colors.TRANSPARENT,
        borderRightColor: colors.TRANSPARENT,
        borderBottomColor: colors.YELLOW.secondary,
        transform: [
            { rotate: '180deg' }
        ],

        marginTop: -1,
        overflow: 'visible'
    },
    verticalLine: { height: height / 18, width: 0.5, backgroundColor: colors.BLACK, alignItems: 'center', marginTop: 10 },
    driverDetails: { flex: 19, alignItems: 'center', justifyContent: 'center' },
    driverPhotoContainer: { flex: 5.4, justifyContent: 'flex-end', alignItems: 'center' },
    driverPhoto: { borderRadius: height / 20 / 2, width: height / 20, height: height / 20 },
    driverNameContainer: { flex: 2.2, alignItems: 'center', justifyContent: 'center' },
    driverNameText: { color: colors.GREY.btnPrimary, fontFamily: 'Roboto-Bold', fontSize: 14 },
    ratingContainer: { flex: 2.4, alignItems: 'center', justifyContent: 'center' },
    ratingContainerStyle: { marginTop: 2, paddingBottom: Platform.OS == 'android' ? 5 : 0 },
    buttonsContainer: { flex: 1.5, flexDirection: 'row' },
    buttonContainer: { flex: 1 },
    buttonTitleText: { fontFamily: 'Roboto-Bold', fontSize: 18, alignSelf: 'flex-end' },
    cancelButtonStyle: { backgroundColor: colors.GREY.secondary, elevation: 0 },
    cancelButtonContainerStyle: { flex: 1, backgroundColor: colors.GREY.secondary },
    callButtonStyle: { backgroundColor: colors.GREY.btnPrimary, elevation: 0 },
    callButtonContainerStyle: { flex: 1, backgroundColor: colors.GREY.btnPrimary },

    //alert modal
    alertModalContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.GREY.background },
    alertModalInnerContainer: { height: 200, width: (width * 0.85), backgroundColor: colors.WHITE, alignItems: 'center', alignSelf: 'center', borderRadius: 7 },
    alertContainer: { flex: 2, justifyContent: 'space-between', width: (width - 100) },
    rideCancelText: { flex: 1, top: 15, color: colors.BLACK, fontFamily: 'Roboto-Bold', fontSize: 20, alignSelf: 'center' },
    horizontalLLine: { width: (width - 110), height: 0.5, backgroundColor: colors.BLACK, alignSelf: 'center', },
    msgContainer: { flex: 2.5, alignItems: 'center', justifyContent: 'center' },
    cancelMsgText: { color: colors.BLACK, fontFamily: 'Roboto-Regular', fontSize: 15, alignSelf: 'center', textAlign: 'center' },
    okButtonContainer: { flex: 1, width: (width * 0.85), flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center' },
    okButtonStyle: { flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignItems: 'center', justifyContent: 'center' },
    okButtonContainerStyle: { flex: 1, width: (width * 0.85), backgroundColor: colors.GREY.iconSecondary, },

    //cancel modal
    cancelModalContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.GREY.background },
    cancelModalInnerContainer: { height: 400, width: width * 0.85, padding: 0, backgroundColor: colors.WHITE, alignItems: 'center', alignSelf: 'center', borderRadius: 7 },
    cancelContainer: { flex: 1, justifyContent: 'space-between', width: (width * 0.85) },
    cancelReasonContainer: { flex: 1 },
    cancelReasonText: { top: 10, color: colors.BLACK, fontFamily: 'Roboto-Bold', fontSize: 20, alignSelf: 'center' },
    radioContainer: { flex: 8, alignItems: 'center' },
    radioText: { fontSize: 16, fontFamily: 'Roboto-Medium', color: colors.DARK, },
    radioContainerStyle: { paddingTop: 30, marginLeft: 10 },
    radioStyle: { paddingBottom: 25 },
    cancelModalButtosContainer: { flex: 1, flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignItems: 'center', justifyContent: 'center' },
    buttonSeparataor: { height: height / 35, width: 0.5, backgroundColor: colors.WHITE, alignItems: 'center', marginTop: 3 },
    cancelModalButttonStyle: { backgroundColor: colors.GREY.iconSecondary, borderRadius: 0 },
    cancelModalButtonContainerStyle: { flex: 1, width: (width * 2) / 2, backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center', margin: 0 },
    signInTextStyle: {
        fontFamily: 'Roboto-Bold',
        fontWeight: "700",
        color: colors.WHITE
    },
    floatButtonStyle: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    },
    CallfloatButtonStyle: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 80,
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    },
    navigateFloatingButton: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 150,
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    }
});
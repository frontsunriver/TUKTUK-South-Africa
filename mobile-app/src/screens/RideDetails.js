import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    ImageBackground,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Header, Rating, Avatar, Button } from 'react-native-elements';
import Dash from 'react-native-dash';
import { colors } from '../common/theme';
var { width } = Dimensions.get('window');
import { language } from 'config';
import { useSelector } from 'react-redux';

export default function RideDetails(props) {

    const paramData = props.navigation.getParam('data');
    const settings = useSelector(state => state.settingsdata.settings);
    const auth = useSelector(state => state.auth);

    const goBack = () => {
        props.navigation.goBack();
    }

    const goToBooking = (id) => {
        props.navigation.replace('BookedCab',{bookingId:id});
    };

    return (
        <View style={styles.mainView}>
            <Header
                backgroundColor={colors.GREY.default}
                leftComponent={{ icon: 'ios-arrow-back', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { goBack() } }}
                centerComponent={<Text style={styles.headerTitleStyle}>{language.ride_details_page_title}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
            />
            <ScrollView>
                <View style={styles.mapView}>
                    <View style={styles.mapcontainer}>
                        {paramData?
                        <MapView style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            region={{
                                latitude: (paramData.pickup.lat),
                                longitude: (paramData.pickup.lng),
                                latitudeDelta: 0.9922,
                                longitudeDelta: 1.9421
                            }}
                        >
                                <Marker
                                    coordinate={{ latitude: paramData ? (paramData.pickup.lat) : 0.00, longitude: paramData ? (paramData.pickup.lng) : 0.00 }}
                                    title={'marker_title_1'}
                                    description={paramData ? paramData.pickup.add : null}
                                    pinColor={colors.GREEN.default}
                                />
                                <Marker
                                    coordinate={{ latitude: (paramData.drop.lat), longitude: (paramData.drop.lng) }}
                                    title={'marker_title_2'}
                                    description={paramData.drop.add}
                                />
                                <MapView.Polyline
                                    coordinates={paramData.coords}
                                    strokeWidth={4}
                                    strokeColor={colors.BLUE.default}
                                />
                        </MapView>
                        :null}
                    </View>
                </View>
                <View style={styles.rideDesc}>

                    <View style={styles.userDesc}>

                        {/* Driver Image */}
                        {paramData ?
                            paramData.driver_image != '' ?
                                <Avatar
                                    size="small"
                                    rounded
                                    source={{ uri: paramData.driver_image }}
                                    activeOpacity={0.7}
                                />
                                : paramData.driver_name != '' ?
                                    <Avatar
                                        size="small"
                                        rounded
                                        source={require('../../assets/images/profilePic.png')}
                                        activeOpacity={0.7}
                                    /> : null



                            : null}
                        <View style={styles.userView}>
                            {/*Driver Name */}
                            {paramData && paramData.driver_name != '' ? <Text style={styles.personStyle}>{paramData.driver_name}</Text> : null}
                            {paramData && paramData.rating > 0 ?

                                <View style={styles.personTextView}>
                                    {/*My rating to driver */}
                                    <Text style={styles.ratingText}>{language.you_rated_text}</Text>
                                    <Rating
                                        showRating
                                        type="star"
                                        fractions={3}
                                        startingValue={parseFloat(paramData.rating)}
                                        readonly
                                        imageSize={15}
                                        style={{ paddingVertical: 10 }}
                                        showRating={false}
                                    />
                                </View>
                                : null}
                        </View>
                    </View>
                    {/*Car details */}
                    {paramData && paramData.carType ?
                        <View style={[styles.userDesc, styles.avatarView]}>

                            <Avatar
                                size="small"
                                rounded
                                source={paramData.carImage ? { uri: paramData.carImage } : require('../../assets/images/microBlackCar.png')}
                                activeOpacity={0.7}
                            />
                            <View style={styles.userView}>
                                <Text style={styles.carNoStyle}>{paramData.vehicle_number ? paramData.vehicle_number : <Text> {language.car_no_not_found}</Text>}</Text>
                                <Text style={styles.carNoStyleSubText}>{paramData.carType}</Text>
                            </View>
                        </View>

                        : null}

                    <View style={styles.userDesc}>
                        <Avatar
                            size="small"
                            source={Platform.OS == 'ios' ? require('../../assets/images/fareMetar.jpg') : require('../../assets/images/fareMetar.jpg')}
                            activeOpacity={0.7}

                        />
                        <View style={styles.userView}>
                            <Text style={styles.textStyle}>{settings.symbol}{paramData && paramData.customer_paid ? parseFloat(paramData.customer_paid).toFixed(2) : paramData && paramData.estimate ? paramData.estimate : 0}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={styles.location}>
                        {paramData && paramData.trip_start_time ?
                            <View>
                                <Text style={styles.timeStyle}>{paramData.trip_start_time}</Text>
                            </View>
                            : null}
                        {paramData && paramData.pickup ?
                            <View style={styles.address}>
                                <View style={styles.redDot} />
                                <Text style={styles.adressStyle}>{paramData.pickup.add}</Text>
                            </View>
                            : null}
                    </View>

                    <View style={styles.location}>
                        {paramData && paramData.trip_end_time ?
                            <View>
                                <Text style={styles.timeStyle}>{paramData.trip_end_time}</Text>
                            </View>
                            : null}
                        {paramData && paramData.drop ?
                            <View style={styles.address}>
                                <View style={styles.greenDot} />
                                <Text style={styles.adressStyle}>{paramData.drop.add}</Text>
                            </View>
                            : null}
                    </View>
                </View>
                {paramData && ['PENDING','PAID','COMPLETE'].indexOf(paramData.status) != -1 ?
                    <View style={styles.billView}>
                        <View style={styles.billView}>
                            <Text style={styles.billTitle}>{language.bill_details_title}</Text>
                        </View>
                        <View style={styles.billOptions}>
                            <View style={styles.billItem}>
                                <Text style={styles.billName}>{language.your_trip}</Text>
                                <Text style={styles.billAmount}>{settings.symbol} {paramData && paramData.trip_cost > 0 ? parseFloat(paramData.trip_cost).toFixed(2) : paramData && paramData.estimate ? parseFloat(paramData.estimate).toFixed(2) : 0}</Text>
                            </View>
                            <View style={styles.billItem}>
                                <View>
                                    <Text style={[styles.billName, styles.billText]}>{language.discount}</Text>
                                    <Text style={styles.taxColor}>{language.promo_apply}</Text>
                                </View>
                                <Text style={styles.discountAmount}> - {settings.symbol}{paramData && paramData.discount_amount ? parseFloat(paramData.discount_amount).toFixed(2) : 0}</Text>

                            </View>

                            {paramData && paramData.cardPaymentAmount ? paramData.cardPaymentAmount > 0 ?
                                <View style={styles.billItem}>
                                    <View>
                                        <Text >{language.CardPaymentAmount}</Text>

                                    </View>
                                    <Text >  {settings.symbol}{paramData && paramData.cardPaymentAmount ? parseFloat(paramData.cardPaymentAmount).toFixed(2) : 0}</Text>

                                </View>
                                : null : null}
                            {paramData && paramData.cashPaymentAmount ? paramData.cashPaymentAmount > 0 ?
                                <View style={styles.billItem}>
                                    <View>
                                        <Text >{language.CashPaymentAmount}</Text>

                                    </View>
                                    <Text>  {settings.symbol}{paramData && paramData.cashPaymentAmount ? parseFloat(paramData.cashPaymentAmount).toFixed(2) : 0}</Text>

                                </View>
                                : null : null}
                            {paramData && paramData.usedWalletMoney ? paramData.usedWalletMoney > 0 ?
                                <View style={styles.billItem}>
                                    <View>
                                        <Text>{language.WalletPayment}</Text>

                                    </View>
                                    <Text >  {settings.symbol}{paramData && paramData.usedWalletMoney ? parseFloat(paramData.usedWalletMoney).toFixed(2) : 0}</Text>

                                </View>
                                : null : null}
                        </View>
                        <View style={styles.paybleAmtView}>
                            <Text style={styles.billTitle}>{language.grand_total}</Text>
                            <Text style={styles.billAmount2}>{settings.symbol}{paramData && paramData.customer_paid ? parseFloat(paramData.customer_paid).toFixed(2) : null}</Text>
                        </View>
                    </View>
                    : null}
                {paramData &&  ['PENDING','PAID','COMPLETE'].indexOf(paramData.status) != -1 ?
                    <View>
                        <View style={styles.iosView}>
                            {
                                Platform.OS == 'ios' ?
                                    <ImageBackground source={require('../../assets/images/dash.png')}
                                        style={styles.backgroundImage}
                                        resizeMode={Platform.OS == 'ios' ? 'repeat' : 'stretch'}>
                                    </ImageBackground>
                                    :
                                    <Dash style={styles.dashView} />
                            }
                        </View>

                        <View style={styles.paymentTextView}>
                            <Text style={styles.billTitle}>{language.payment_status}</Text>
                        </View>
                        {paramData && paramData.status ?
                            <View style={styles.billOptions}>
                                <View style={styles.billItem}>
                                    <Text style={styles.billName}>{language.payment_status}</Text>
                                    <Text style={styles.billAmount}>{language[paramData.status]}</Text>

                                </View>
                                {['PAID','COMPLETE'].indexOf(paramData.status) != -1 ?
                                <View style={styles.billItem}>
                                    <Text style={styles.billName}>{language.pay_mode}</Text>
                                    <Text style={styles.billAmount}>{paramData.payment_mode ? paramData.payment_mode : null} {paramData.gateway ? '(' + paramData.gateway + ')' : null}</Text>
                                </View>
                                :null}
                            </View>
                            : <View style={styles.billOptions}>
                                <View style={styles.billItem}></View>
                            </View>}
                    </View>
                :null}
                {(paramData && paramData.status &&  auth && auth.info && auth.info.profile && 
                    (((['NEW','ACCEPTED','ARRIVED','STARTED','REACHED','PENDING','PAID'].indexOf(paramData.status) != -1) && auth.info.profile.usertype=='rider') ||
                    ((['ACCEPTED','ARRIVED','STARTED','REACHED'].indexOf(paramData.status) != -1) && auth.info.profile.usertype=='driver')))?
                    <View style={styles.locationView2}>
                        <Button
                            title={language.go_to_booking}
                            loading={false}
                            loadingProps={{ size: "large", color: colors.GREEN.default }}
                            titleStyle={styles.buttonTitleText2}
                            onPress={() => { goToBooking(paramData.id) }}
                            containerStyle={styles.paynowButton}
                        />
                    </View> : null}
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    containerView: {
        flex: 1
    },
    textContainer: {
        textAlign: "center"
    },
    mapView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
        marginBottom: 15
    },
    mapcontainer: {
        flex: 7,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
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
        ]
    },
    rideDesc: {
        flexDirection: 'column'
    },
    userDesc: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    userView: {
        flexDirection: 'column',
        paddingLeft: 28,
    },
    locationView: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        padding: 10,
        marginVertical: 14,
        justifyContent: "space-between",
    },
    locationView2: {
        flex: 1,
        flexDirection: 'row',
        // paddingHorizontal: 10,
        padding: 10,
        marginVertical: 14,

    },
    // callButtonStyle:{
    // width:400
    // },
    location: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 6
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    address: {
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 0,
        marginLeft: 6
    },
    billView: {
        marginVertical: 5
    },
    billTitle: {
        fontSize: 18,
        color: colors.GREY.default,
        fontFamily: 'Roboto-Bold'
    },
    billOptions: {
        marginHorizontal: 10,
        marginVertical: 6
    },
    billItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 15
    },
    billName: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.default
    },
    billAmount: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: colors.GREY.default
    },
    discountAmount: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: colors.RED
    },

    billAmount2: {
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: colors.GREY.default
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: 2,
    },
    carNoStyle: {
        fontSize: 16,
        //fontWeight: 'bold', 
        fontFamily: 'Roboto-Medium'
    },
    carNoStyleSubText: {
        fontSize: 16,
        //fontWeight: 'bold', 
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.default
    },
    textStyle: {
        fontSize: 16,
        //fontWeight: 'bold', 
        fontFamily: 'Roboto-Medium'
    },
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight 
    },
    personStyle: {
        fontSize: 16,
        //fontWeight: 'bold', 
        color: colors.BLACK,
        fontFamily: 'Roboto-Medium'
    },
    personTextView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        fontSize: 16,
        color: colors.GREY.iconSecondary,
        marginRight: 8,
        fontFamily: 'Roboto-Regular'
    },
    avatarView: {
        marginVertical: 15
    },
    timeStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginTop: 1
    },
    adressStyle: {
        marginLeft: 6,
        fontSize: 15,
        lineHeight: 20
    },
    billView: {
        paddingHorizontal: 14
    },
    billText: {
        fontFamily: 'Roboto-Bold'
    },
    taxColor: {
        color: colors.GREY.default
    },
    paybleAmtView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    iosView: {
        paddingVertical: 10
    },
    dashView: {
        width: width, height: 1
    },
    paymentTextView: {
        paddingHorizontal: 10
    },
    // callButtonStyle:{
    //     width:50+'%'
    // },
    callButtonContainerStyle1: {
        flex: 1,
        width: '80%',
        height: 100
    },
    callButtonContainerStyle2: {
        flex: 1,
        width: '80%',
        height: 100,
        paddingLeft: 10
    },
    paynowButton: {
        flex: 1,
        width: '80%',
        height: 150,
        paddingLeft: 10
    },
});
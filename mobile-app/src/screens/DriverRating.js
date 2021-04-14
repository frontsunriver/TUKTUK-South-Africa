import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Platform,
    Image,
    Modal,
    Dimensions
} from 'react-native';
import { Divider, Button, Header } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { colors } from '../common/theme';
var { width } = Dimensions.get('window');
import { language, dateStyle } from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from 'common/src';

export default function DriverRating(props) {
    const { api } = useContext(FirebaseContext);
    const { updateBooking } = api;
    const dispatch = useDispatch();
    const [starCount, setStarCount] = useState(0);
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const settings = useSelector(state => state.settingsdata.settings);

    const booking = props.navigation.getParam('booking');

    const onStarRatingPress = (rating) => {
        setStarCount(rating);
    }

    const skipRating = () => {
        let curBooking = {...booking};
        curBooking.status = 'COMPLETE';
        dispatch(updateBooking(curBooking));
        props.navigation.navigate('Map');
    }


    const submitNow = () => {
        let curBooking = {...booking};
        curBooking.rating = starCount;
        curBooking.status = 'COMPLETE';
        dispatch(updateBooking(curBooking));
        props.navigation.navigate('Map');
    }

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

                            <Text style={styles.rideCancelText}>{language.no_driver_found_alert_title}</Text>

                            <View style={styles.horizontalLLine} />

                            <View style={styles.msgContainer}>
                                <Text style={styles.cancelMsgText}>{language.thanks}</Text>
                            </View>
                            <View style={styles.okButtonContainer}>
                                <Button
                                    title={language.no_driver_found_alert_OK_button}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => {
                                        setAlertModalVisible(false);
                                        props.navigation.navigate('Map')
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

    return (
        <View style={styles.mainViewStyle}>
            <Header
                backgroundColor={colors.GREY.default}
                leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { props.navigation.toggleDrawer(); } }}
                centerComponent={<Text style={styles.headerTitleStyle}>{language.receipt}</Text>}
                rightComponent={<Text style={styles.headerskip} onPress={() => { skipRating() }}>{language.skip}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.headerInnerStyle}
            />
            <View style={styles.dateViewStyle}>
                <Text style={styles.dateViewTextStyle}>{booking && booking.tripdate ? new Date(booking.tripdate).toLocaleString(dateStyle) : null}</Text>
            </View>

            <View style={styles.rateViewStyle}>
                <Text style={styles.rateViewTextStyle}>{settings.symbol}{booking ? booking.customer_paid > 0 ? parseFloat(booking.customer_paid).toFixed(2) : 0 : null}</Text>
            </View>

            <View style={styles.addressViewStyle}>

                <View style={styles.pickUpStyle}>

                    <View style={styles.greenDot}></View>
                    <Text style={styles.addressViewTextStyle}>{booking.pickup.add}</Text>
                </View>

                <View style={styles.pickUpStyle}>
                    <View style={styles.redDot}></View>
                    <Text style={styles.addressViewTextStyle}>{booking.drop.add}</Text>
                </View>

            </View>

            <View style={styles.tripMainView}>
                <View style={{ flex: 3.2, justifyContent: 'center', alignItems: "center" }}>
                    <View style={styles.tripSummaryStyle}>
                        <Divider style={[styles.divider, styles.summaryStyle]} />
                        <Text style={styles.summaryText}>{language.rate_ride} </Text>
                        <Divider style={[styles.divider, styles.dividerStyle]} />
                    </View>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: "center" }}>
                        {booking ?

                            booking.driver_image != '' ? <Image source={{ uri: booking.driver_image }} style={{ height: 78, width: 78, borderRadius: 78 / 2 }} /> :

                                <Image source={require('../../assets/images/profilePic.png')} style={{ height: 78, width: 78, borderRadius: 78 / 2 }} />

                            : null}
                    </View>
                    <View style={styles.tripSummaryStyle}>
                        <Text style={styles.Drivername}>{booking ? booking.driver_name : null}</Text>

                    </View>
                </View>
                <View style={styles.ratingViewStyle}>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        starSize={40}
                        fullStar={'ios-star'}
                        halfStar={'ios-star-half'}
                        emptyStar={'ios-star-outline'}
                        iconSet={'Ionicons'}
                        fullStarColor={colors.YELLOW.primary}
                        emptyStarColor={colors.YELLOW.primary}
                        halfStarColor={colors.YELLOW.primary}
                        rating={starCount}
                        selectedStar={(rating) => onStarRatingPress(rating)}
                        buttonStyle={{ padding: 20 }}
                        containerStyle={styles.contStyle}
                    />
                </View>
            </View>

            <View style={styles.confBtnStyle}>
                <Button
                    title={language.submit_rating}
                    titleStyle={{ fontFamily: 'Roboto-Bold', }}
                    onPress={() => submitNow()}
                    buttonStyle={styles.myButtonStyle}
                    disabled={starCount > 0 ? false : true}

                />
            </View>
            {
                alertModal()
            }
        </View>
    )

}
const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
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
    headerskip: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Regular',
        fontSize: 16
    },
    dateViewStyle: {
        justifyContent: "center",
        flex: 1,
        marginTop: 20
    },
    dateViewTextStyle: {
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.btnPrimary,
        fontSize: 26,
        textAlign: "center"
    },
    rateViewStyle: {
        alignItems: 'center',
        flex: 2
    },
    rateViewTextStyle: {
        fontSize: 60,
        color: colors.BLACK,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
        textAlign: "center"
    },
    addressViewStyle: {
        flex: 3,
        paddingTop: 22,
        flex: 4,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    addressViewTextStyle: {
        color: colors.GREY.secondary,
        fontSize: 19,
        fontFamily: 'Roboto-Regular',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        lineHeight: 24
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 12,
        height: 12,
        borderRadius: 50
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 12,
        height: 12,
        borderRadius: 50
    },
    divider: {
        backgroundColor: colors.GREY.secondary,
        width: '20%',
        height: 1,
        top: '2.7%'
    },
    summaryText: {
        color: colors.GREY.btnPrimary,
        fontSize: 18,
        textAlign: "center",
        fontFamily: 'Roboto-Regular',
    },
    Drivername: {
        color: colors.GREY.btnPrimary,
        fontSize: 22,
        textAlign: "center",
        fontFamily: 'Roboto-Regular',
    },
    mainViewStyle: {
        flex: 1,
        backgroundColor: colors.WHITE,
        flexDirection: 'column',
        //marginTop: StatusBar.currentHeight
    },
    pickUpStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tripMainView: {
        flex: 6,
        flexDirection: "column",
        justifyContent: "center",
    },
    ratingViewStyle: {
        flex: 1.8,
        flexDirection: "row",
        justifyContent: "center"
    },
    tripSummaryStyle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
    },
    confBtnStyle: {
        flex: 2,
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: '5%',
        marginBottom: '10%',
        alignItems: 'center'
    },
    myButtonStyle: {
        backgroundColor: colors.GREEN.default,
        width: 300,
        padding: 10,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 10
    },
    contStyle: {
        marginTop: 0,
        paddingBottom: Platform.OS == 'android' ? 5 : 0
    }, summaryStyle: {
        justifyContent: "flex-end"
    },
    dividerStyle: {
        justifyContent: "flex-start"
    },
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
});
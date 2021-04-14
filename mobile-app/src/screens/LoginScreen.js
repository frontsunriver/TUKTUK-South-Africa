import React, { useState, useRef, useEffect, useContext } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Alert,
    TextInput,
    Image,
    ActivityIndicator
} from "react-native";
import MaterialButtonDark from "../components/MaterialButtonDark";
import { TouchableOpacity } from "react-native-gesture-handler";
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from 'common/src';
import { colors } from '../common/theme';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import RNPickerSelect from 'react-native-picker-select';
import { 
    language,
    countries, 
    default_country_code,
    FirebaseConfig,
    features
} from 'config';

export default function EmailLoginScreen(props) {
    const { api } = useContext(FirebaseContext);
    const {
        signIn,
        sendResetMail,
        clearLoginError,
        requestPhoneOtpDevice,
        mobileSignIn,
        checkUserExists
    } = api;
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const formatCountries = () => {
        let arr = [];
        for (let i = 0; i < countries.length; i++) {
            arr.push({ label: countries[i].label + " (+" + countries[i].phone + ")", value: "+" + countries[i].phone, key: countries[i].code });
        }
        return arr;
    }
    const [state, setState] = useState({
        email: '',
        password: '',
        customStyleIndex: 0,
        phoneNumber: null,
        verificationId: null,
        verificationCode: null,
        countryCodeList: formatCountries(),
        countryCode: "+" + default_country_code.phone
    });

    const emailInput = useRef(null);
    const passInput = useRef(null);
    const pageActive = useRef(false);
    const [loading,setLoading] = useState(false);
    const recaptchaVerifier = useRef(null);

    useEffect(() => {
        if(auth.info && pageActive.current){
            pageActive.current = false;
            props.navigation.navigate('AuthLoading');
            setLoading(false);
        }
        if (auth.error && auth.error.msg && pageActive.current && auth.error.msg.message !== language.not_logged_in) {
            pageActive.current = false;
            Alert.alert(language.alert, auth.error.msg.message);
            dispatch(clearLoginError());
            setLoading(false);
        }
        if(auth.verificationId){
            pageActive.current = false;
            setState({ ...state, verificationId: auth.verificationId });
            setLoading(false);
        }
    }, [auth.info,auth.error,auth.error.msg,auth.verificationId]);

    onPressLogin = async () => {
        setLoading(true);
        if (state.countryCode && state.countryCode !== language.select_country) {
            if (state.phoneNumber) {
                let formattedNum = state.phoneNumber.replace(/ /g, '');
                formattedNum = state.countryCode + formattedNum.replace(/-/g, '');
                if (formattedNum.length > 8) {
                    checkUserExists({mobile:formattedNum}).then((res)=>{
                        if(res.users && res.users.length>0){
                            pageActive.current = true;
                            dispatch(requestPhoneOtpDevice(formattedNum,recaptchaVerifier.current));
                        }
                        else{
                            setLoading(false);
                            Alert.alert(language.alert,language.user_does_not_exists);
                        }
                    });
                } else {
                    Alert.alert(language.alert,language.mobile_no_blank_error);
                    setLoading(false);
                }
            } else {
                Alert.alert(language.alert,language.mobile_no_blank_error);
                setLoading(false);
            }
        } else {
            Alert.alert(language.alert,language.country_blank_error);
            setLoading(false);
        }
    }

    onSignIn = async () => {
        setLoading(true);
        pageActive.current = true;
        dispatch(mobileSignIn(                
            state.verificationId,
            state.verificationCode
        ));
    }

    CancelLogin = () => {
        setState({
            ...state,
            phoneNumber: null,
            verificationId: null,
            verificationCode: null
        });
    }

    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const emailValid = re.test(email);
        if (!emailValid) {
            emailInput.current.focus();
            setLoading(false);
            Alert.alert(language.alert, language.valid_email_check);
        }
        return emailValid;
    }

    onAction = async () => {
        setLoading(true);
        const { email, password } = state;
        if (validateEmail(email)) {
            if (password != '') {
                pageActive.current = true;
                dispatch(signIn(email, password));
                setState({
                    ...state,
                    email: '',
                    password: ''
                });
                emailInput.current.focus();
            } else {
                passInput.current.focus();
                setLoading(false);
                Alert.alert(language.alert, language.password_blank_messege);
            }
        }

    }

    Forgot_Password = async (email) => {
        if (validateEmail(email)) {
            Alert.alert(
                language.forgot_password_link,
                language.forgot_password_confirm,
                [
                    { text: language.cancel, onPress: () => { }, style: 'cancel', },
                    {
                        text: language.ok,
                        onPress: () => {
                            pageActive.current = true;
                            dispatch(sendResetMail(email));
                        },
                    }
                ],
                { cancelable: true },
            )
        }
    }

    handleCustomIndexSelect = (index) => {
        setState({ ...state, customStyleIndex: index });
    };


    return (
        <KeyboardAvoidingView behavior={"position"} style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/bg.jpg')}
                resizeMode="stretch"
                style={styles.imagebg}
            >
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={FirebaseConfig}
                    attemptInvisibleVerification={true}
                />
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => { props.navigation.navigate('Intro') }}>
                        <Image
                            source={require("../../assets/images/ios-back.png")}
                            resizeMode="contain"
                            style={styles.backButtonImage}
                        ></Image>
                    </TouchableOpacity>
                </View>
                <SegmentedControlTab
                    values={[language.email_login, language.mobile_login_title]}
                    selectedIndex={state.customStyleIndex}
                    onTabPress={handleCustomIndexSelect}
                    borderRadius={0}
                    tabsContainerStyle={styles.segmentcontrol}
                    tabStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        borderColor: 'transparent',
                    }}
                    activeTabStyle={{ borderBottomColor: colors.GREY.background, backgroundColor: 'transparent', borderBottomWidth: 2, marginTop: 2 }}
                    tabTextStyle={{ color: colors.WHITE, fontWeight: 'bold' }}
                    activeTabTextStyle={{ color: colors.GREY.background }}
                />
                {state.customStyleIndex == 0 ?
                    <View style={styles.box1}>
                        <TextInput
                            ref={emailInput}
                            style={styles.textInput}
                            placeholder={language.email_placeholder}
                            onChangeText={(value) => setState({ ...state, email: value })}
                            value={state.email}
                        />
                    </View>
                :null}
                {state.customStyleIndex == 0 ?
                    <View style={styles.box2}>
                        <TextInput
                            ref={passInput}
                            style={styles.textInput}
                            placeholder={language.password_placeholder}
                            onChangeText={(value) => setState({ ...state, password: value })}
                            value={state.password}
                            secureTextEntry={true}
                        />
                    </View>
                :null}
                {state.customStyleIndex == 0 ?
                    <MaterialButtonDark
                        onPress={onAction}
                        style={styles.materialButtonDark}
                    >{language.login_button}</MaterialButtonDark>
                :null}
                {state.customStyleIndex == 0 ?
                    <View style={styles.linkBar}>
                        <TouchableOpacity style={styles.barLinks} onPress={() => Forgot_Password(state.email)}>
                            <Text style={styles.linkText}>{language.forgot_password_link}</Text>
                        </TouchableOpacity>
                    </View>
                : null}
                {state.customStyleIndex != 0 ?
                <View style={styles.box1}>
                    <RNPickerSelect
                        placeholder={{ label: language.select_country, value: language.select_country }}
                        value={state.countryCode}
                        useNativeAndroidPickerStyle={true}
                        style={{
                            inputIOS: styles.pickerStyle,
                            inputAndroid: styles.pickerStyle,
                        }}
                        onValueChange={(value) => setState({ ...state, countryCode: value })}
                        items={state.countryCodeList}
                        disabled={!!state.verificationId || !features.AllowCountrySelection ? true : false}
                    />
                </View>
                : null}
                {state.customStyleIndex != 0 ?
                <View style={styles.box2}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={language.mobile_no_placeholder}
                        onChangeText={(value) => setState({ ...state, phoneNumber: value })}
                        value={state.phoneNumber}
                        editable={!!state.verificationId ? false : true}
                        keyboardType="phone-pad"
                    />
                </View>
                : null}
                {state.customStyleIndex != 0?state.verificationId ? null :
                    <MaterialButtonDark
                        onPress={onPressLogin}
                        style={styles.materialButtonDark}
                    >{language.request_otp}</MaterialButtonDark>
                :null}
                {state.customStyleIndex != 0 && !!state.verificationId ?
                    <View style={styles.box2}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={language.otp_here}
                            onChangeText={(value) => setState({ ...state, verificationCode: value })}
                            value={state.verificationCode}
                            ditable={!!state.verificationId}
                            keyboardType="phone-pad"
                            secureTextEntry={true}
                        />
                    </View>
                    : null}
                {state.customStyleIndex != 0 && !!state.verificationId ?
                    <MaterialButtonDark
                        onPress={onSignIn}
                        style={styles.materialButtonDark}
                    >{language.authorize}</MaterialButtonDark>
                    : null}
                {state.verificationId ?
                    <View style={styles.actionLine}>
                        <TouchableOpacity style={styles.actionItem} onPress={CancelLogin}>
                            <Text style={styles.actionText}>{language.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                : null}
                {loading?
                    <View style={styles.loading}>
                        <ActivityIndicator color={colors.BLACK} size='large' />
                    </View>
                :null}
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom:40
      },
    container: {
        flex: 1
    },
    imagebg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    topBar: {
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        height: Dimensions.get('window').height * 0.52
    },
    backButton: {
        height: 40,
        width: 40,
        marginLeft: 35,
        marginTop: 45
    },
    backButtonImage: {
        height: 40,
        width: 40,
    },
    segmentcontrol: {
        color: colors.WHITE,
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        marginTop: 0,
        alignSelf: "center",
        height: 50,
        marginLeft: 35,
        marginRight: 35
    },

    box1: {
        height: 35,
        backgroundColor: colors.WHITE,
        marginTop: 26,
        marginLeft: 35,
        marginRight: 35,
        borderWidth: 1,
        borderColor: colors.GREY.border,
        justifyContent: 'center'
    },
    box2: {
        height: 35,
        backgroundColor: colors.WHITE,
        marginTop: 12,
        marginLeft: 35,
        marginRight: 35,
        borderWidth: 1,
        borderColor: colors.GREY.border,
        justifyContent: 'center'
    },

    textInput: {
        color: colors.GREY.background,
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        textAlign: "left",
        marginTop: 8,
        marginLeft: 5
    },
    materialButtonDark: {
        height: 35,
        marginTop: 22,
        marginLeft: 35,
        marginRight: 35,
        backgroundColor: colors.GREY.iconSecondary,
    },
    linkBar: {
        flexDirection: "row",
        marginTop: 30,
        alignSelf: 'center'
    },
    barLinks: {
        marginLeft: 15,
        marginRight: 15,
        alignSelf: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    linkText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.WHITE,
        fontFamily: "Roboto-Bold",
    },
    pickerStyle: {
        color: colors.GREY.background,
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        marginLeft: 5
    },

    actionLine: {
        height: 20,
        flexDirection: "row",
        marginTop: 20,
        alignSelf: 'center'
    },
    actionItem: {
        height: 20,
        marginLeft: 15,
        marginRight: 15,
        alignSelf: "center"
    },
    actionText: {
        fontSize: 15,
        fontFamily: "Roboto-Regular",
        fontWeight: 'bold'
    }
});
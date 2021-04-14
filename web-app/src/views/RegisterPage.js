import React, { useState, useContext } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import image from "assets/img/background.jpg";
import { useSelector, useDispatch } from "react-redux";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import AlertDialog from '../components/AlertDialog';
import CountrySelect from '../components/CountrySelect';
import {
  language,
  default_country_code,
  features
} from 'config';
import { FirebaseContext } from 'common';

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const { api } = useContext(FirebaseContext);
  const {
    clearLoginError,
    emailSignUp,
    checkUserExists,
    validateReferer
  } = api;

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    email: '',
    mobile: '',
    password: '',
    firstName: '',
    lastName: '',
    usertype: 'rider',
    referralId: ''
  });

  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
  const [countryCode, setCountryCode] = useState(default_country_code);
  const [mobileWithoutCountry, setMobileWithoutCountry] = useState('');

  const classes = useStyles();
  const { ...rest } = props;

  const onInputChange = (event) => {
    setState({ ...state, [event.target.id]: event.target.value })
  }

  const validateMobile = () => {
    let mobileValid = true;
    if (mobileWithoutCountry.length < 6) {
      mobileValid = false;
      setCommonAlert({ open: true, msg: language.mobile_no_blank_error })
    }
    if(mobileWithoutCountry.includes('+') || mobileWithoutCountry.includes(' ') || mobileWithoutCountry.includes('-') ){
      mobileValid = false;
      setCommonAlert({ open: true, msg: language.mobile_no_blank_error })
    }
    return mobileValid;
  }

  const validatePassword = (complexity) => {
    let passwordValid = true;
    const regx1 = /^([a-zA-Z0-9@*#]{8,15})$/
    const regx2 = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
    if (complexity === 'any') {
      passwordValid = state.password.length >= 1;
      if (!passwordValid) {
        setCommonAlert({ open: true, msg: language.password_blank_messege })
      }
    }
    else if (complexity === 'alphanumeric') {
      passwordValid = regx1.test(state.password);
      if (!passwordValid) {
        setCommonAlert({ open: true, msg: language.password_alphaNumeric_check })
      }
    }
    else if (complexity === 'complex') {
      passwordValid = regx2.test(state.password);
      if (!passwordValid) {
        setCommonAlert({ open: true, msg: language.password_complexity_check })
      }
    }
    return passwordValid
  }

  const handleRegister = (e) => {
    e.preventDefault();
    //eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (state.firstName.length > 0 && state.lastName.length > 0) {
      if (re.test(state.email)) {
        if (validatePassword('alphanumeric')) {
          if (validateMobile()) {
            checkUserExists(state).then((res) => {
              if (res.users && res.users.length > 0) {
                setCommonAlert({ open: true, msg: language.user_exists })
              }
              else if(res.error){
                setCommonAlert({ open: true, msg: language.email_or_mobile_issue })
              }
              else{
                if (state.referralId && state.referralId.length > 0) {
                  validateReferer(state.referralId).then((referralInfo) => {
                    if (referralInfo.uid) {
                      emailSignUp({...state, signupViaReferral: referralInfo.uid}).then((res)=>{
                        if(res.uid){
                          setCommonAlert({ open: true, msg: language.account_create_successfully });
                          setTimeout(()=>{
                            props.history.push('/login');
                          },3000);
                        }else{
                          setCommonAlert({ open: true, msg: language.reg_error });
                        }
                      })
                    } else {
                      setCommonAlert({ open: true, msg: language.referer_not_found });
                    }
                  }).catch((error) => {
                    setCommonAlert({ open: true, msg: language.referer_not_found });
                  });
                } else {
                  emailSignUp(state).then((res)=>{
                    if(res.uid){
                      setCommonAlert({ open: true, msg: language.account_create_successfully });
                      setTimeout(()=>{
                        props.history.push('/login');
                      },3000);
                    }else{
                      setCommonAlert({ open: true, msg: language.reg_error });
                    }
                  })
                }
              }
            });
          } else {
            setCommonAlert({ open: true, msg: language.mobile_no_blank_error });
          }
        }
      } else {
        setCommonAlert({ open: true, msg: language.proper_email });
      }
    } else {
      setCommonAlert({ open: true, msg: language.proper_input_name });

    }
  };

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: '' });
    if (auth.error.flag) {
      dispatch(clearLoginError());
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    props.history.push('/login');
  };

  return (
    <div>
      <Header
        absolute
        color="transparent"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div id="sign-in-button" />
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card>
                <form className={classes.form}>

                  <Paper square className={classes.root} style={{ paddingTop: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <Tabs
                      value={0}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="inherit"
                      aria-label="switch login type"
                    >
                      <Tab disabled={true} icon={<EmailIcon />} label={language.register_email} aria-label="email" />
                    </Tabs>
                  </Paper>

                  <CardBody>
                    <CustomInput
                      labelText={language.firstname}
                      id="firstName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={onInputChange}
                      value={state.firstName}
                    />
                    <CustomInput    // LAST NAME
                      labelText={language.lastname}
                      id="lastName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={onInputChange}
                      value={state.lastName}
                    />
                    <CustomInput
                      labelText={language.email}
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={onInputChange}
                      value={state.email}
                    />
                    <CustomInput
                      labelText={language.password}
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                      onChange={onInputChange}
                      value={state.password}
                    />
                    {features.AllowCountrySelection ?   // COUNTRY
                      <CountrySelect
                        value={countryCode}
                        onChange={
                          (object, value) => {
                            setCountryCode(value);
                            let formattedNum = mobileWithoutCountry.replace(/ /g, '');
                            formattedNum = "+" + value.phone + formattedNum.replace(/-/g, '');
                            setState({ ...state, mobile: formattedNum })
                          }
                        }
                        style={{ paddingTop: 20 }}
                        disabled={state.verificationId ? true : false}
                      />
                      : null}
                    <CustomInput
                      labelText={language.phone}
                      id="mobile"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        disabled: state.verificationId ? true : false,
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={
                        (event) => {
                          setMobileWithoutCountry(event.target.value)
                          let formattedNum = event.target.value.replace(/ /g, '');
                          formattedNum = "+" + countryCode.phone + formattedNum.replace(/-/g, '');
                          setState({ ...state, mobile: formattedNum })
                        }
                      }
                      value={mobileWithoutCountry}
                    />
                    <CustomInput    // LAST NAME
                      labelText={language.referralId}
                      id="referralId"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={onInputChange}
                      value={state.referralId}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleRegister}>
                      {language.register}
                    </Button>
                    <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleBack}>
                      {language.back}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
        <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
      </div>
    </div>
  );
}

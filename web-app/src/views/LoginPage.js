import React, { useState, useEffect, useContext } from 'react';
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
import CardHeader from "components/Card/CardHeader.js";
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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button as RegularButton} from "@material-ui/core";
import {
  language,
  default_country_code,
  features
} from 'config';
import { FirebaseContext } from 'common';

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const { api, authRef, RecaptchaVerifier } = useContext(FirebaseContext);
  const {
    signIn,
    facebookSignIn,
    clearLoginError,
    mobileSignIn,
    signOut,
    sendResetMail,
    checkUserExists
  } = api;

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loginType, setLoginType] = React.useState(0);
  const [activeReg, setActiveReg] = React.useState(false);
  const [openFPModal, setOpenFPModal] = React.useState(false);
  const [capatchaReady, setCapatchaReady] = React.useState(false);

  const [data, setData] = React.useState({
    email: '',
    pass: '',
    country: default_country_code.phone,
    mobile: '',
    password: '',
    otp: '',
    verificationId: null,
    firstName: '',
    lastName: '',
    selectedcountry:default_country_code,
    usertype:'rider',
    referralId:''
  });
  
  const [tabDisabled, setTabDisabled] = React.useState(false);
  const [fpEmail, setFpEmail] = React.useState("");

  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });

  const classes = useStyles();
  const { ...rest } = props;

  useEffect(() => {
    if(!capatchaReady){
      window.recaptchaVerifier = new RecaptchaVerifier("sign-in-button",{
        'size': 'invisible',
        'callback': function(response) {
          setCapatchaReady(true);
        }
      });
    }
    if (auth.info) {
      if(auth.info.profile){
        let role = auth.info.profile.usertype;
        if(role==='admin' || role==='fleetadmin'){
          props.history.push('/dashboard');
        }
        else if (role==='driver'){
          props.history.push('/bookings');
        }
        else {
          features.WebsitePagesEnabled?props.history.push('/'):props.history.push('/bookings');
        }
      }else{
        if(!activeReg){
          setActiveReg(true);
          if(auth.info.phoneNumber){
            setData({...data,mobile:auth.info.phoneNumber})
            setLoginType(1);
          }else{
            setData({...data,email:auth.info.email})
            setLoginType(0);
          }
          setTabDisabled(true);
          setCommonAlert({ open: true, msg: language.login_success });
        }
      } 
    }
    if (auth.error && auth.error.flag && auth.error.msg.message !== language.not_logged_in) {
      setCommonAlert({ open: true, msg: auth.error.msg.message })
    }
    if(auth.verificationId){
      setData({ ...data, verificationId: auth.verificationId });
    }
  }, [auth.info, auth.error, auth.verificationId, props.history, data, data.email,activeReg,capatchaReady,RecaptchaVerifier]);

  const handleTabChange = (event, newValue) => {
    setLoginType(newValue);
  };

  const handleFacebook = (e) => {
    e.preventDefault();
    dispatch(facebookSignIn());
  }

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: '' });
    if (auth.error.flag) {
      setData({...data,email:'',pass:''});
      dispatch(clearLoginError());
    }
  };

  const onInputChange = (event) => {
    setData({ ...data, [event.target.id]: event.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //eslint-disable-next-line
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email) && data.pass.length > 0) {
      dispatch(signIn(data.email, data.pass));
    } else {
      setCommonAlert({ open: true, msg: language.login_validate_error})
    }
    setData({...data,email:'',pass:''});
  }

  const handleGetOTP = (e) => {
    e.preventDefault();
    const phoneNumber = "+" + data.country + data.mobile;
    checkUserExists({mobile:phoneNumber}).then((res)=>{
      if(res.users && res.users.length>0){
          const appVerifier = window.recaptchaVerifier;
          authRef
          .signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(res => {
              setData({...data, verificationId: res.verificationId})
          })
          .catch(error => {
              setCommonAlert({ open: true, msg: error.code + ": " + error.message})
          });
      }
      else{
          setCommonAlert({ open: true, msg: language.user_does_not_exists})
      }
    });
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (data.otp.length === 6 && parseInt(data.otp) > 100000 & parseInt(data.otp) < 1000000) {
      dispatch(mobileSignIn(data.verificationId, data.otp));
    } else {
      setCommonAlert({ open: true, msg: language.otp_validate_error})
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(signOut());
    setTabDisabled(false);
    setActiveReg(false);  
  }

  const onCountryChange = (object, value) => {
    if (value && value.phone) {
      setData({ ...data, country: value.phone, selectedcountry:value });
    }
  };

  const handleRegister = (e) => {
    props.history.push('/register');
  };

  const handleForgotPass = (e) => {
    e.preventDefault();
    setOpenFPModal(true);
  };

  const onFPModalEmailChange = (e) => {
    e.preventDefault();
    setFpEmail(e.target.value);
  }

  const handleCloseFP = (e) => {
    e.preventDefault();
    setFpEmail('');
    setOpenFPModal(false);
  }

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(sendResetMail(fpEmail));
    setFpEmail('');
    setOpenFPModal(false);
  }

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
                  {features.FacebookLoginEnabled?
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>{language.signIn}</h4>
                    <div className={classes.socialLine}>
                      {features.FacebookLoginEnabled?
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"

                        onClick={handleFacebook}
                      >
                        <i className={"fab fa-facebook"} />
                      </Button>
                      :null}
                    </div>
                  </CardHeader>
                  :null}
                  <Paper square className={classes.root} style={!(features.FacebookLoginEnabled)?{paddingTop:20,borderTopLeftRadius:10,borderTopRightRadius:10}:null}>
                    <Tabs
                      value={loginType}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="inherit"
                      aria-label="switch login type"
                    >
                      <Tab disabled={tabDisabled} icon={<EmailIcon />} label={language.email_tab}  aria-label="email" />
                      {features.MobileLoginEnabled?
                      <Tab disabled={tabDisabled} icon={<PhoneIcon />} label={language.phone_tab} aria-label="phone" />
                      :null}
                    </Tabs>
                  </Paper>

                  <CardBody>
                    {loginType === 0 ?    //EMAIL
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
                        value={data.email}
                      />
                      : null}
                    {loginType === 0?
                      <CustomInput
                        labelText={language.password}
                        id="pass"
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
                        value={data.pass}
                      />
                      : null}
                    { loginType === 1 && features.AllowCountrySelection ?   // COUNTRY
                      <CountrySelect
                        value={data.selectedcountry}
                        onChange={onCountryChange}
                        style={{paddingTop:20}}
                        disabled={data.verificationId ? true : false}
                      />
                      : null}
                    {loginType === 1 ?   //MOBILE
                      <CustomInput
                        labelText={language.phone}
                        id="mobile"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          required: true,
                          disabled: data.verificationId ? true : false,
                          endAdornment: (
                            <InputAdornment position="end">
                              <PhoneIcon className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                        onChange={onInputChange}
                        value={data.mobile}
                      />
                      : null}
                    {data.verificationId && loginType === 1 ?    // OTP
                      <CustomInput
                        labelText={language.otp}
                        id="otp"
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
                        value={data.otp}
                      />
                      : null}
                    {loginType === 0 ?  
                      <RegularButton 
                        color="inherit" 
                        onClick={handleForgotPass}
                        disableElevation={true}
                        disableFocusRipple={true}
                        disableRipple={true}
                        className={classes.forgotButton}
                        variant="text"
                      >
                          {language.forgot_password}
                      </RegularButton>
                    : null}
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    {loginType === 0 ?
                      <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleSubmit}>
                        {language.login}
                    </Button>
                      : null}
                    {loginType === 0 ?
                      <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleRegister}>
                        {language.register}
                    </Button>
                      : null}

                    {loginType === 1 && !data.verificationId ?
                      <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleGetOTP}>
                        {language.get_otp}
                    </Button>
                      : null}
                    { loginType === 1 &&  data.verificationId ?
                      <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleVerifyOTP}>
                        {language.verify_otp}
                    </Button>
                      : null}

                    { loginType === 1 && data.verificationId ?
                      <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleCancel}>
                        {language.cancel}
                    </Button>
                      : null}

                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
        <Dialog open={openFPModal} onClose={handleCloseFP} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{language.forgot_pass_title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {language.forgot_pass_description}
          </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={language.email}
              type="email"
              fullWidth
              onChange={onFPModalEmailChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFP} color="primary">
            {language.cancel}
          </Button>
            <Button onClick={handleResetPassword} color="primary">
            {language.reset_password}
          </Button>
          </DialogActions>
        </Dialog>
        <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
      </div>
    </div>
  );
}

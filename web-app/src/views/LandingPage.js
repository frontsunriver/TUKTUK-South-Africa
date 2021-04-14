import React, { useState, useEffect, useContext } from 'react';
import classNames from "classnames";
import { makeStyles } from '@material-ui/core/styles';
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';
import GoogleMapsAutoComplete from '../components/GoogleMapsAutoComplete';
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import ProductSection from "./Sections/ProductSection.js";
import SectionDownload from "./Sections/SectionDownload.js";
import { useSelector, useDispatch } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AlertDialog from '../components/AlertDialog';
import {language} from 'config';
import { FirebaseContext } from 'common';

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const { api } = useContext(FirebaseContext);
  const {
    getEstimate, 
    clearEstimate,
    addBooking, 
    clearBooking,
    MinutesPassed,
    GetDateString
  } = api;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { ...rest } = props;
  const cartypes = useSelector(state => state.cartypes.cars);
  const estimatedata = useSelector(state => state.estimatedata);
  const bookingdata = useSelector(state => state.bookingdata);
  const settings = useSelector(state => state.settingsdata.settings);
  const [carType, setCarType] = useState(language.select_car);
  const [pickupAddress, setPickupAddress] = useState(null);
  const [dropAddress, setDropAddress] = useState(null);
  const [estimateModalStatus, setEstimateModalStatus] = React.useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const auth = useSelector(state => state.auth);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
  const [bookingType, setBookingType] = useState('Book Now');
  const [role, setRole] = useState(null);
  const [selectedDate, setSelectedDate] = useState(GetDateString());

  const handleCarSelect = (event) => {
    setCarType(event.target.value);
    let carDetails = null;
    for (let i = 0; i < cartypes.length; i++) {
      if (cartypes[i].name === event.target.value) {
        carDetails = cartypes[i];
      }
    }
    setSelectedCarDetails(carDetails);
  };

  const handleBookTypeSelect = (event) => {
      setBookingType(event.target.value);
      if(bookingType==='Book Later'){
          setSelectedDate(GetDateString());
      }
  };

  const onDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    if (estimatedata.estimate) {
      setEstimateModalStatus(true);
    }
    if(auth.info && auth.info.profile){
      setRole(auth.info.profile.usertype);
    }
  }, [estimatedata.estimate,auth.info]);


  const handleGetEstimate = (e) => {
    e.preventDefault();
    if (auth.info) {
      if (pickupAddress && dropAddress && selectedCarDetails) {
        if(bookingType==='Book Now'){
            dispatch(getEstimate({
              platform:'web',
              pickup: pickupAddress,
              drop: dropAddress,
              carDetails: selectedCarDetails,
            }));
        }else{
          if(bookingType==='Book Later' && selectedDate){
            if(MinutesPassed(selectedDate)>=15){
              dispatch(getEstimate({
                platform:'web',
                pickup: pickupAddress,
                drop: dropAddress,
                carDetails: selectedCarDetails,
              }));
            }else{
              setCommonAlert({ open: true, msg: language.past_booking_error });
            }
          }else{
            setCommonAlert({ open: true, msg: language.select_proper });
          }
        }
      } else {
        setCommonAlert({ open: true, msg: language.select_proper })
      }
    } else {
      setCommonAlert({ open: true, msg: language.must_login })
    }
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    setEstimateModalStatus(false);
    dispatch(addBooking({
      pickup: pickupAddress,
      drop: dropAddress,
      carDetails: selectedCarDetails,
      userDetails: auth.info,
      estimate: estimatedata.estimate,
      tripdate: new Date(selectedDate).toString(),
      bookLater: bookingType==='Book Later'?true:false,
      settings:settings,
      booking_type_web: true
    }));

  };

  const handleEstimateModalClose = (e) => {
    e.preventDefault();
    setEstimateModalStatus(false);
    dispatch(clearEstimate());
  };

  const handleEstimateErrorClose = (e) => {
    e.preventDefault();
    dispatch(clearEstimate());
  };

  const handleBookingAlertClose = (e) => {
    e.preventDefault();
    dispatch(clearBooking());
    dispatch(clearEstimate());
    props.history.push('/bookings');
  };

  const handleBookingErrorClose = (e) => {
    e.preventDefault();
    dispatch(clearBooking());
  };

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: '' })
  };

  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax filter image={require("assets/img/background.jpg")}>
        {(cartypes && !role) || (cartypes && (role === 'rider' || role === 'admin'))?
          <div className={classes.container}>
            <GridContainer spacing={2}>
              <GridItem xs={12} sm={12} md={6} lg={6}>
                <br />
                <h1 className={classes.title}>{language.book_your_cab}</h1>
              </GridItem>
            </GridContainer>
            <GridContainer spacing={2}>
              <GridItem xs={12} sm={12} md={6} lg={6}>
                <Paper >
                  <GoogleMapsAutoComplete 
                    placeholder={language.pickup_location}
                    variant={"filled"}
                    value={pickupAddress}
                    onChange={
                      (value) => {
                        setPickupAddress(value);
                      }
                    }
                  />
                </Paper>
              </GridItem>
            </GridContainer>
            <GridContainer spacing={2}>
              <GridItem xs={12} sm={12} md={6} lg={6}>
                <Paper>
                  <GoogleMapsAutoComplete 
                    placeholder={language.drop_location}
                    variant={"filled"}
                    value={dropAddress}
                    onChange={
                      (value) => {
                        setDropAddress(value);
                      }
                    }
                  />
                </Paper>
              </GridItem>
            </GridContainer>
            <GridContainer spacing={2}>
            <GridItem xs={6} sm={6} md={3} lg={3}>
                <FormControl style={{ width: '100%' }}>
                  <Select
                    id="car-type-native"
                    value={carType}
                    onChange={handleCarSelect}
                    className={carType === language.select_car ? classes.inputdimmed : classes.input}
                  >
                    <MenuItem value={language.select_car} key={language.select_car}>
                      {language.select_car}
                    </MenuItem>
                    {
                      cartypes.map((car) =>
                        <MenuItem key={car.name} value={car.name}>
                          <img src={car.image} className={classes.carphoto} alt="car types" />{car.name}
                        </MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={6} sm={6} md={3} lg={3}>
                <FormControl style={{ width: '100%' }}>
                  <Select
                    id="booking-type-native"
                    value={bookingType}
                    onChange={handleBookTypeSelect}
                    className={classes.input}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem key={"Book Now"} value={"Book Now"}>
                      {language.book_now}
                    </MenuItem>
                    <MenuItem key={"Book Later"} value={"Book Later"}>
                      {language.book_later}
                    </MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
            <GridContainer spacing={2}>
              {bookingType==='Book Later'?
              <GridItem xs={6} sm={6} md={4} lg={4}>
                <TextField
                  id="datetime-local"
                  label={language.booking_date_time}
                  type="datetime-local"
                  variant="filled"
                  fullWidth
                  className={classes.commonInputStyle}
                  InputProps={{
                    className: classes.input
                  }}
                  value = {selectedDate}
                  onChange={onDateChange}
                />
              </GridItem>
              :null}
              <GridItem xs={6} sm={6} md={bookingType==='Book Later'?2:6} lg={bookingType==='Book Later'?2:6}>
                <Button
                  color="success"
                  size="lg"
                  rel="noopener noreferrer"
                  className={classes.items}
                  onClick={handleGetEstimate}
                  style={{height:bookingType==='Book Later'?76:52}}
                >
                  <i className="fas fa-car" />
                  {language.book_now}
                </Button>
              </GridItem>
            </GridContainer>
          </div>
          : 
          <div className={classes.container}>
            <GridContainer spacing={2}>
              <GridItem xs={12} sm={12} md={6} lg={6}>
                <br />
                <h1 className={classes.title}>{language.landing_slogan}</h1>
              </GridItem>
            </GridContainer>
          </div>
          }
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection />
        </div>
      </div>
      <div className={classNames(classes.main2, classes.mainRaised2)}>
        <div className={classes.container}>
          <SectionDownload />
        </div>
      </div>
      <Footer />
      <Dialog
        open={estimateModalStatus}
        onClose={handleEstimateModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{language.estimate}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {settings?settings.symbol:null} {estimatedata.estimate ? estimatedata.estimate.estimateFare : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEstimateModalClose} color="primary">
            {language.cancel}
          </Button>
          <Button onClick={confirmBooking} color="primary" autoFocus>
            {language.book}
          </Button>
        </DialogActions>
      </Dialog>
      <AlertDialog open={bookingdata.booking ? true : false} onClose={handleBookingAlertClose}>{bookingdata.booking ? language.booking_success + bookingdata.booking.booking_id : null}</AlertDialog>
      <AlertDialog open={bookingdata.error.flag} onClose={handleBookingErrorClose}>{bookingdata.error.msg}</AlertDialog>
      <AlertDialog open={estimatedata.error.flag} onClose={handleEstimateErrorClose}>{estimatedata.error.msg}</AlertDialog>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
    </div>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import {
  Select,
  MenuItem,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  TextField
} from '@material-ui/core';
import GoogleMapsAutoComplete from '../components/GoogleMapsAutoComplete';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import { language } from 'config';
import { makeStyles } from '@material-ui/core/styles';
import UsersCombo from '../components/UsersCombo';
import { FirebaseContext } from 'common';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    alignContent: 'center'
  },
  title: {
    color: "#000",
  },
  gridcontainer: {
    alignContent: 'center'
  },
  items: {
    margin: 0,
    width: '100%'
  },
  input: {
    fontSize: 18,
    color: "#000"
  },
  inputdimmed: {
    fontSize: 18,
    color: "#737373"
  },
  carphoto: {
    height: '18px',
    marginRight: '10px'
  },
  buttonStyle: {
    margin: 0,
    width: '100%',
    height: '100%'
  }
}));

export default function AddBookings(props) {
  const { api } = useContext(FirebaseContext);
  const {
    getEstimate, 
    clearEstimate,
    addBooking, 
    clearBooking,
    MinutesPassed,
    GetDateString
  } = api;
  const dispatch = useDispatch();
  const classes = useStyles();
  const cartypes = useSelector(state => state.cartypes.cars);
  const estimatedata = useSelector(state => state.estimatedata);
  const bookingdata = useSelector(state => state.bookingdata);
  const userdata = useSelector(state => state.usersdata);
  const settings = useSelector(state => state.settingsdata.settings);
  const [carType, setCarType] = useState(language.select_car);
  const [pickupAddress, setPickupAddress] = useState(null);
  const [dropAddress, setDropAddress] = useState(null);
  const [estimateModalStatus, setEstimateModalStatus] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const [users, setUsers] = useState(null);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
  const [userCombo, setUserCombo] = useState(null);
  const [estimateRequested, setEstimateRequested] = useState(false);
  const [bookingType, setBookingType] = useState('Book Now');
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
    if (bookingType === 'Book Later') {
      setSelectedDate(GetDateString());
    }
  };

  const onDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    if (estimatedata.estimate && estimateRequested) {
      setEstimateRequested(false);
      setEstimateModalStatus(true);
    }
    if (userdata.users) {
      let arr = [];
      for (let i = 0; i < userdata.users.length; i++) {
        let user = userdata.users[i];
        if (user.usertype === 'rider') {
          arr.push({
            'firstName': user.firstName,
            'lastName': user.lastName,
            'mobile': user.mobile,
            'email': user.email,
            'uid': user.id,
            'desc': user.firstName + ' ' + user.lastName + ' (' + user.mobile + ') ' + user.email,
            'pushToken': user.pushToken
          });
        }
      }
      setUsers(arr);
    }
  }, [estimatedata.estimate, userdata.users, estimateRequested]);


  const handleGetEstimate = (e) => {
    e.preventDefault();
    setEstimateRequested(true);
    if (userCombo && pickupAddress && dropAddress && selectedCarDetails) {
      if (bookingType === 'Book Now') {
        dispatch(getEstimate({
          pickup: pickupAddress,
          drop: dropAddress,
          carDetails: selectedCarDetails,
        }));
      } else {
        if (bookingType === 'Book Later' && selectedDate) {
          if (MinutesPassed(selectedDate) >= 15) {
            dispatch(getEstimate({
              pickup: pickupAddress,
              drop: dropAddress,
              carDetails: selectedCarDetails,
            }));
          } else {
            setCommonAlert({ open: true, msg: language.past_booking_error });
          }
        } else {
          setCommonAlert({ open: true, msg: language.select_proper });
        }
      }
    } else {
      setCommonAlert({ open: true, msg: language.select_proper })
    }
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    setEstimateModalStatus(false);
    let bookingObject = {
      pickup: pickupAddress,
      drop: dropAddress,
      carDetails: selectedCarDetails,
      userDetails: {
        uid:userCombo.uid,
        profile:{
          firstName: userCombo.firstName,
          lastName: userCombo.lastName,
          mobile: userCombo.mobile,
          pushToken: userCombo.pushToken
        }
      },
      estimate: estimatedata.estimate,
      tripdate: new Date(selectedDate).toString(),
      bookLater: bookingType === 'Book Later' ? true : false,
      settings: settings,
      booking_type_web: true
    };
    dispatch(addBooking(bookingObject));
  };

  const handleEstimateModalClose = (e) => {
    e.preventDefault();
    setEstimateModalStatus(false);
    dispatch(clearEstimate());
    setEstimateRequested(false);
  };

  const handleEstimateErrorClose = (e) => {
    e.preventDefault();
    dispatch(clearEstimate());
    setEstimateRequested(false);
  };

  const handleBookingAlertClose = (e) => {
    e.preventDefault();
    dispatch(clearBooking());
    dispatch(clearEstimate());
    clearForm();
  };

  const clearForm = () => {
    setUserCombo(null);
    setPickupAddress(null);
    setDropAddress(null);
    setSelectedCarDetails(null);
    setCarType(language.select_car);
    setBookingType(language.book_now);
    setEstimateRequested(false);
  }

  const handleBookingErrorClose = (e) => {
    e.preventDefault();
    dispatch(clearBooking());
    setEstimateRequested(false);
  };

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: '' })
  };

  return (
    <div className={classes.container}>
      <Grid item xs={12} sm={12} md={8} lg={8}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Typography component="h1" variant="h5" className={classes.title}>
              {language.addbookinglable}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {users ?
              <UsersCombo
                className={classes.items}
                placeholder={language.select_user}
                users={users}
                value={userCombo}
                onChange={(event, newValue) => {
                  setUserCombo(newValue);
                }}
              />
              : null}
          </Grid>
          <Grid item xs={12}>
            <GoogleMapsAutoComplete
              variant={"outlined"}
              placeholder={language.pickup_location}
              value={pickupAddress}
              className={classes.items}
              onChange={
                (value) => {
                  setPickupAddress(value);
                }
              }
            />
          </Grid>
          <Grid item xs={12}>
            <GoogleMapsAutoComplete placeholder={language.drop_location}
              variant={"outlined"}
              value={dropAddress}
              className={classes.items}
              onChange={
                (value) => {
                  setDropAddress(value);
                }
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {cartypes ?
              <Select
                id="car-type-native"
                value={carType}
                onChange={handleCarSelect}
                variant="outlined"
                fullWidth
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
              : null}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              id="booking-type-native"
              value={bookingType}
              onChange={handleBookTypeSelect}
              className={classes.input}
              variant="outlined"
              fullWidth
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem key={"Book Now"} value={"Book Now"}>
                {language.book_now}
              </MenuItem>
              <MenuItem key={"Book Later"} value={"Book Later"}>
                {language.book_later}
              </MenuItem>
            </Select>
          </Grid>
          {bookingType === 'Book Later' ?
            <Grid item xs={12} sm={6} >
              <TextField
                id="datetime-local"
                label={language.booking_date_time}
                type="datetime-local"
                variant="outlined"
                fullWidth
                className={classes.commonInputStyle}
                InputProps={{
                  className: classes.input
                }}
                value={selectedDate}
                onChange={onDateChange}
              />
            </Grid>
            : null}
          <Grid item xs={12} sm={6} >
            <Button
              size="large"
              onClick={handleGetEstimate}
              variant="contained" 
              color="primary"
              className={classes.buttonStyle}
            >
              <i className="fas fa-car" />
              {language.book}
            </Button>
          </Grid>
        </Grid>
      </Grid>
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
            {language.book_now}
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
import React, { useState, useEffect, useContext } from 'react';
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import Button from "components/CustomButtons/Button.js";
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import {language} from "config";
import AlertDialog from '../components/AlertDialog';
import { FirebaseContext } from 'common';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: 192,
    height: 192
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const MyProfile = () => {
  const { api } = useContext(FirebaseContext);
  const {
    updateProfile
  } = api;
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [commonAlert, setCommonAlert] = useState({open:false,msg:''});

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    loginType:null,
    usertype:''
  });

  useEffect(() => {
    if (auth.info && auth.info.profile) {
      setData({
        firstName: !auth.info.profile.firstName || auth.info.profile.firstName === ' '? '' : auth.info.profile.firstName,
        lastName: !auth.info.profile.lastName || auth.info.profile.lastName === ' '? '' : auth.info.profile.lastName,
        email: !auth.info.profile.email || auth.info.profile.email === ' '? '' : auth.info.profile.email,
        mobile: !auth.info.profile.mobile || auth.info.profile.mobile === ' '? '' : auth.info.profile.mobile,
        loginType:auth.info.profile.loginType?'social':'email',
        usertype:auth.info.profile.usertype,
        uid:auth.info.uid
      });
    }
  }, [auth.info]);

  const updateData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(data.email)){
      dispatch(updateProfile(auth.info,{
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile
      }));
      setCommonAlert({open:true,msg:language.profile_updated})
    }else{
      setCommonAlert({open:true,msg:language.proper_email})
    }
  }

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({open:false,msg:''})
  };

  return (
    auth.loading ? <CircularLoading /> :
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Typography component="h1" variant="h5">
              {language.profile}
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label={language.firstname}
              name="firstName"
              autoComplete="firstName"
              onChange={updateData}
              value={data.firstName}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label={language.lastname}
              name="lastName"
              autoComplete="lastName"
              onChange={updateData}
              value={data.lastName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={language.email}
              name="email"
              autoComplete="email"
              onChange={updateData}
              value={data.email}
              disabled={data.loginType==='email'?true:false}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="mobile"
              label={language.phone}
              name="mobile"
              autoComplete="mobile"
              onChange={updateData}
              value={data.mobile}
              disabled={data.loginType==='email'?true:false}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="usertype"
              label={language.usertype}
              name="usertype"
              value={data.usertype}
              disabled={true}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              className={classes.submit}
            >
              {language.submit}
            </Button>
          </form>
        </div>
        <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
      </Container>
  );
};

export default MyProfile;
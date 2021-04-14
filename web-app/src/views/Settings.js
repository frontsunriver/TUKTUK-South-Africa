import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import CircularLoading from "../components/CircularLoading";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import {
  features,
  language
} from 'config';
import { FirebaseContext } from 'common';

const useStyles = makeStyles(theme => ({
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
  gridcontainer: {
    alignContent: 'center'
  },
  items: {
    margin: 0,
    width: '100%'
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

const Settings = (props) => {
  const { api } = useContext(FirebaseContext);
  const {
    editSettings,
    clearSettingsViewError
  } = api;
  const settingsdata = useSelector(state => state.settingsdata);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [data, setData] = useState({
    code: 'USD',
    symbol: '$',
    bonus: 0,
    panic: '',
    otp_secure: false,
    driver_approval: false,
    email_verify: false,
    CarHornRepeat: false,
    CompanyName: '',
    CompanyWebsite: '',
    CompanyTerms: '',
    TwitterHandle: '',
    FacebookHandle: '',
    InstagramHandle: '',
    AppleStoreLink: '',
    PlayStoreLink: '',
    license: '',
    contact_email: '',
    convert_to_mile: false
  });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (settingsdata.settings) {
      setData(settingsdata.settings);
    }
  }, [settingsdata.settings]);

  const handleSwitchChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  const handleTextChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleBonusChange = (e) => {
    setData({ ...data, bonus: parseFloat(e.target.value) >= 0 ? parseFloat(e.target.value) : '' });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (features.AllowCriticalEditsAdmin) {
      if (data.bonus === '') {
        alert(language.proper_bonus)
      } else {
        setClicked(true);
        dispatch(editSettings(data));
      }
    } else {
      alert(language.demo_mode);
    }
  }

  const handleClose = () => {
    setClicked(false);
    dispatch(clearSettingsViewError());
  };

  return (
    settingsdata.loading ? <CircularLoading /> :
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography component="h1" variant="h5">
              {language.currency_settings}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="symbol"
                  label={language.currency_symbol}
                  name="symbol"
                  autoComplete="symbol"
                  onChange={handleTextChange}
                  value={data.symbol}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label={language.currency_code}
                  name="code"
                  autoComplete="code"
                  onChange={handleTextChange}
                  value={data.code}
                />
              </Grid>
            </Grid>
            <Typography component="h1" variant="h5">
              {language.referral_bonus}
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="bonus"
              label={language.referral_bonus}
              name="bonus"
              autoComplete="bonus"
              onChange={handleBonusChange}
              value={data.bonus}
            />
            <Typography component="h1" variant="h5" style={{marginTop:8}}>
              {language.security_title}
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="panic"
              label={language.panic_num}
              name="panic"
              autoComplete="panic"
              onChange={handleTextChange}
              value={data.panic}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.otp_secure}
                  onChange={handleSwitchChange}
                  name="otp_secure"
                  color="primary"
                />
              }
              label={language.settings_label3}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.driver_approval}
                  onChange={handleSwitchChange}
                  name="driver_approval"
                  color="primary"
                />
              }
              label={language.settings_label4}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.email_verify}
                  onChange={handleSwitchChange}
                  name="email_verify"
                  color="primary"
                />
              }
              label={language.settings_label5}
            />
            <Typography component="h1" variant="h5" style={{marginTop:'10px'}}>
              {language.advance_settings}
            </Typography>
            <FormControlLabel style={{ marginTop: '10px' }}
              control={
                <Switch
                  checked={data.CarHornRepeat}
                  onChange={handleSwitchChange}
                  name="CarHornRepeat"
                  color="primary"
                />
              }
              label={language.car_horn_repeat}
            />
            <FormControlLabel style={{ marginTop: '10px' }}
              control={
                <Switch
                  checked={data.convert_to_mile}
                  onChange={handleSwitchChange}
                  name="convert_to_mile"
                  color="primary"
                />
              }
              label={language.convert_to_mile}
            />
            <Typography component="h1" variant="h5" style={{marginTop:8}}>
              {language.purchase_settings_title}
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="license"
              label={language.purchase_code}
              name="license"
              autoComplete="license"
              onChange={handleTextChange}
              value={data.license}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="contact_email"
              label={language.contact_email}
              name="contact_email"
              autoComplete="contact_email"
              onChange={handleTextChange}
              value={data.contact_email}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography component="h1" variant="h5">
              {language.app_info}
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="CompanyName"
              label={language.CompanyName}
              name="CompanyName"
              autoComplete="CompanyName"
              onChange={handleTextChange}
              value={data.CompanyName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="CompanyWebsite"
              label={language.CompanyWebsite}
              name="CompanyWebsite"
              autoComplete="CompanyWebsite"
              onChange={handleTextChange}
              value={data.CompanyWebsite}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="CompanyTerms"
              label={language.terms}
              name="CompanyTerms"
              autoComplete="CompanyTerms"
              onChange={handleTextChange}
              value={data.CompanyTerms}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="FacebookHandle"
              label={language.FacebookHandle}
              name="FacebookHandle"
              autoComplete="FacebookHandle"
              onChange={handleTextChange}
              value={data.FacebookHandle}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="TwitterHandle"
              label={language.TwitterHandle}
              name="TwitterHandle"
              autoComplete="TwitterHandle"
              onChange={handleTextChange}
              value={data.TwitterHandle}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="InstagramHandle"
              label={language.InstagramHandle}
              name="InstagramHandle"
              autoComplete="InstagramHandle"
              onChange={handleTextChange}
              value={data.InstagramHandle}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="AppleStoreLink"
              label={language.AppleStoreLink}
              name="AppleStoreLink"
              autoComplete="AppleStoreLink"
              onChange={handleTextChange}
              value={data.AppleStoreLink}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="PlayStoreLink"
              label={language.PlayStoreLink}
              name="PlayStoreLink"
              autoComplete="PlayStoreLink"
              onChange={handleTextChange}
              value={data.PlayStoreLink}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {language.submit}
            </Button>
          </Grid>
        </Grid>
        <AlertDialog open={settingsdata.error.flag && clicked} onClose={handleClose}>{language.update_failed}</AlertDialog>
      </form>
  );

}

export default Settings;

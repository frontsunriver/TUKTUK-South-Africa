/*eslint-disable*/
import React, {useState, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import { Info, AccountBox, House } from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { useSelector } from "react-redux";
import { language } from "config";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  useEffect(()=>{
    if(auth.info && auth.info.profile){
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
  },[auth.info]);

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); history.push('/') }}
        >
          <House className={classes.icons} />{language.home}
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); history.push('/bookings') }}
        >
          {loggedIn?
            <AccountBox className={classes.icons} /> 
            : 
            <AccountBox className={classes.icons} />  
          }         
         
          {loggedIn?
            language.myaccount
            : 
           language.login_signup
          }
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); history.push('/about-us') }}
        >
          <Info className={classes.icons} />{language.about_us}
        </Button>
      </ListItem>
      {settings && settings.FacebookHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-facebook"
          title={language.follow_facebook}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href={settings.FacebookHandle}
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
      {settings && settings.TwitterHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title={language.follow_twitter}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href={settings.TwitterHandle}
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
      {settings && settings.InstagramHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title={language.follow_instagram}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href={settings.InstagramHandle}
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
    </List>
  );
}

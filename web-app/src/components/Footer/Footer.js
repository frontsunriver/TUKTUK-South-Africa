/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-react/components/footerStyle.js";
import { useHistory } from 'react-router-dom';
import { language } from "config";
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const settings = useSelector(state => state.settingsdata.settings);
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  let history = useHistory();
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                style={{cursor:'pointer'}}
                className={classes.block}
                onClick={(e) => { e.preventDefault(); history.push('/') }}
              >
                {language.home}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                style={{cursor:'pointer'}}
                onClick={(e) => { e.preventDefault(); history.push('/bookings') }}
              >
                {language.myaccount}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                style={{cursor:'pointer'}}
                onClick={(e) => { e.preventDefault(); history.push('/about-us') }}
              >
                {language.about_us}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                style={{cursor:'pointer'}}  
                className={classes.block}
                onClick={(e) => { e.preventDefault(); history.push('/privacy-policy') }}
              >
                {language.privacy_policy}
              </a>
            </ListItem>
          </List>
        </div>
        {settings && settings.CompanyWebsite?
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear() + " "} 
          <a
            href={settings.CompanyWebsite}
            className={aClasses}
            target="_blank"
          >
            {settings.CompanyName}
          </a>
        </div>
        :null}
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};

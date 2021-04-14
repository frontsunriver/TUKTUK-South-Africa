/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// core components
import styles from "assets/jss/material-kit-react/views/componentsSections/downloadStyle.js";
import { language } from "config";
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

export default function SectionDownload() {
  const settings = useSelector(state => state.settingsdata.settings);
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer className={classes.textCenter} justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>{language.mobile_apps_on_store}</h2>
            <img className={classes.triobanner} src={require("../../assets/img/triobanner.png")} alt="App Banner" />
          </GridItem>
          <GridItem xs={12} sm={8} md={6} style={{paddingTop:30}}>
            {settings && settings.AppleStoreLink?
            <a href={settings.AppleStoreLink}><img src={require("../../assets/img/appstore.png")} alt="Apple Store Link"/></a>
            :null}
            <span style={{marginRight: '5px'}}></span>
            {settings && settings.PlayStoreLink?
            <a href={settings.PlayStoreLink}><img src={require("../../assets/img/playstore.png")} alt="Playstore Link"/></a>
            :null}
          </GridItem>
        </GridContainer>

      </div>
    </div>
  );
}

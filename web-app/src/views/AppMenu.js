import React, { useContext } from 'react';
import {
  Typography,
  ListItemIcon,
  Divider,
  MenuList,
  MenuItem
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import HomeIcon from '@material-ui/icons/Home';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CarIcon from '@material-ui/icons/DirectionsCar';
import ListIcon from '@material-ui/icons/ListAlt';
import ExitIcon from '@material-ui/icons/ExitToApp';
import OfferIcon from '@material-ui/icons/LocalOffer';
import PeopleIcon from '@material-ui/icons/People';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import NotifyIcon from '@material-ui/icons/NotificationsActive';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { 
  language,
  features
} from 'config';
import assets from 'assets';
import { FirebaseContext } from 'common';

function AppMenu() {
  const { api } = useContext(FirebaseContext);
  const {
    signOut
  } = api;
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const LogOut = () => {
    dispatch(signOut());
  };

  let isAdmin = auth.info && auth.info.profile && auth.info.profile.usertype === 'admin';
  let isFleetAdmin = auth.info && auth.info.profile && auth.info.profile.usertype === 'fleetadmin';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#444444' }}>
        <img style={{ marginTop: '20px', marginBottom: '20px', width: '120px', height: '120px' }} src={assets.logo192x192} alt="Logo" />
      </div>
      <Divider />
      <MenuList>
        {features.WebsitePagesEnabled?
        <MenuItem component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.home}</Typography>
        </MenuItem>
        :null}
        {isAdmin || isFleetAdmin?
        <MenuItem component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.dashboard_text}</Typography>
        </MenuItem>
        :null}
        <MenuItem component={Link} to="/bookings">
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.booking_history}</Typography>
        </MenuItem>
        {isAdmin?
        <MenuItem component={Link} to="/addbookings">
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.addbookinglable}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/riders">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.riders}</Typography>
        </MenuItem>
        :null}
        {isAdmin || isFleetAdmin?
        <MenuItem component={Link} to="/drivers">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.drivers}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/fleetadmins">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.fleetadmins}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/cartypes">
          <ListItemIcon>
            <CarIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.car_type}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/cancelreasons">
          <ListItemIcon>
            <CarIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.cancellation_reasons}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/earningreports">
          <ListItemIcon>
            <MoneyIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.earning_reports}</Typography>
        </MenuItem>
        :null}
        {isAdmin || isFleetAdmin?
        <MenuItem component={Link} to="/driverearning">
          <ListItemIcon>
            <MoneyIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.driver_earning}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/addtowallet">
          <ListItemIcon>
            <MoneyIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.add_to_wallet}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/withdraws">
          <ListItemIcon>
            <MoneyIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.withdraws}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/promos">
          <ListItemIcon>
            <OfferIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.promo}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/notifications">
          <ListItemIcon>
            <NotifyIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.push_notification_title}</Typography>
        </MenuItem>
        :null}
        {isAdmin?
        <MenuItem component={Link} to="/settings">
          <ListItemIcon>
            <LocalAtmIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.settings_title}</Typography>
        </MenuItem>
        :null}
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <PersonOutlineIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.profile}</Typography>
        </MenuItem>
        <MenuItem onClick={LogOut}>
          <ListItemIcon>
            <ExitIcon />
          </ListItemIcon>
          <Typography variant="inherit">{language.logout}</Typography>
        </MenuItem>
      </MenuList>
    </div>
  );
}

export default AppMenu;
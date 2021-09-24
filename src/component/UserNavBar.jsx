import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  AppBar,
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import LockIcon from "@material-ui/icons/Lock";

import Drawer from "./Drawer";

const useStyles = makeStyles((theme) => ({
  nav: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4527a0",
  },
  auth_title: {
    marginLeft: theme.spacing(3),
    color: theme.palette.primary.paper,
  },
  icon: {
    color: theme.palette.primary.paper,
    marginRight: theme.spacing(3),
  },
  purple: {
    backgroundColor: "#4527a0",
  },
  indicator: {
    backgroundColor: theme.palette.primary.paper,
    // marginLeft: theme.spacing(2.5),
    maxWidth: theme.spacing(0),
  },
  primary: {
    fontWeight: "400",
    marginLeft: theme.spacing(4),
  },
  wrapper: {
    fontFamily: "Roboto",
    fontSize: theme.spacing(2.2),
    color: theme.palette.primary.paper,
    textTransform: "capitalize",
  },
  root: {
    color: theme.palette.primary.black,
  },
  account_name: {
    fontWeight: "450",
    fontSize: theme.spacing(2.2),
  },
  profile_container: {
    margin: theme.spacing(-1.5, -1, -0.5),
  },
  list_items: { margin: theme.spacing(-1, -1, -1) },
}));

export default function UserNavBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (location.pathname === "/") {
      setValue(0);
    } else if (location.pathname === "/employees") {
      setValue(1);
    } else if (location.pathname === "/designations") {
      setValue(2);
    }
  }, [location]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("loginUser");
    window.location.href = "/login";
    props.logout();
    toast.success("Logged out successfully!, Comeback later :)", {
      position: "top-center",
      autoClose: 2000,
      pauseOnHover: true,
    });
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <List className={classes.profile_container}>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.purple}>N</Avatar>
          </ListItemAvatar>
          <ListItemText
            classes={{ primary: classes.account_name }}
            primary="Nithin Raj"
            secondary="nithin@gmail.com"
          />
        </ListItem>
      </List>
      <Divider />

      <List className={classes.list_items}>
        <ListItem>
          <PersonIcon />
          <ListItemText
            classes={{ primary: classes.primary }}
            primary="My Account"
          ></ListItemText>
        </ListItem>
        <ListItem>
          <SettingsIcon />

          <ListItemText
            classes={{ primary: classes.primary }}
            primary="Settings"
          ></ListItemText>
        </ListItem>
        <ListItem onClick={handleLogout}>
          <LockIcon />
          <ListItemText
            classes={{ primary: classes.primary }}
            primary="Logout"
          ></ListItemText>
        </ListItem>
      </List>
    </Menu>
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const activeStyle = {
    backgroundColor: "#311b92",
    // boxShadow: "-1px 1px 9px 1px rgba(253,248,248,0.75) inset",
  };

  const isDesktop = useMediaQuery("(min-width:730px)");

  return (
    <>
      {isDesktop ? (
        <AppBar position="fixed" className={classes.nav}>
          <Typography
            variant="h6"
            component="h1"
            className={classes.auth_title}
          >
            Admin Template
          </Typography>
          <Tabs
            classes={{ root: classes.root, indicator: classes.indicator }}
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            centered
          >
            <Tab
              classes={{ wrapper: classes.wrapper }}
              component={NavLink}
              exact
              to="/"
              activeStyle={activeStyle}
              label="Home"
              disableRipple
            />
            <Tab
              classes={{ wrapper: classes.wrapper }}
              component={NavLink}
              exact
              to="/employees"
              activeStyle={activeStyle}
              label="Employees"
              disableRipple
            />
            <Tab
              classes={{ wrapper: classes.wrapper }}
              component={NavLink}
              exact
              to="/designations"
              activeStyle={activeStyle}
              label="Designations"
              disableRipple
            />
          </Tabs>
          <IconButton
            className={classes.icon}
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Tooltip title="Profile" interactive>
              <AccountCircle />
            </Tooltip>
          </IconButton>
        </AppBar>
      ) : (
        <Drawer />
      )}
      {renderMenu}
    </>
  );
}

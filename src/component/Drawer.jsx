import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Toolbar,
  Typography,
  SwipeableDrawer,
  List,
  Divider,
  ListItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { toast } from "react-toastify";
import WorkIcon from "@material-ui/icons/Work";
import PeopleIcon from "@material-ui/icons/People";
import HomeIcon from "@material-ui/icons/Home";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#311b92",
  },
  title_container: {
    marginLeft: theme.spacing(0),
    color: theme.palette.primary.paper,
  },
  icons: {
    color: theme.palette.primary.paper,
    marginRight: theme.spacing(1),
  },
  drawer_container: {
    backgroundColor: theme.palette.primary.paper,
    margin: theme.spacing(0, 1),
    height: theme.spacing(110),
  },
  link_text: {
    marginLeft: theme.spacing(1),
  },
  avatar_style: {
    backgroundColor: "#311b92",
  },
  arrow: {
    margin: theme.spacing(3, -5, 0, 5),
  },
  root_text: {
    color: "#000",
  },
  primary: {
    fontWeight: "400",
    marginLeft: theme.spacing(4),
  },
  account_name: {
    fontWeight: "450",
    fontSize: theme.spacing(2.2),
  },
}));

export default function Drawer(props) {
  const classes = useStyles();

  const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem("loginUser");

    window.location.href = "/login";

    toast.success("Logged out successfully!, Comeback later :)", {
      position: "top-center",
      autoClose: 2000,
      pauseOnHover: true,
    });
  };

  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setState(open);
  };

  const [downArrow, setDownArrow] = useState(true);

  const handleDownwardArrow = () => {
    setDownArrow(false);
  };

  const handleUpwardArrow = () => {
    setDownArrow(true);
  };

  const activeStyle = {
    backgroundColor: "#ede7f6",
    color: "#311b92",
    borderRadius: "10px",
  };

  const list = () => (
    <div className={classes.drawer_container} role="presentation">
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar_style}>N</Avatar>
          </ListItemAvatar>
          <ListItemText
            classes={{ primary: classes.account_name }}
            primary="Nithin Raj"
            secondary="nithin@gmail.com"
          />
          {downArrow ? (
            <ListItemAvatar className={classes.arrow}>
              <ExpandMoreIcon onClick={handleDownwardArrow} />
            </ListItemAvatar>
          ) : (
            <ListItemAvatar className={classes.arrow}>
              <ExpandLessIcon onClick={handleUpwardArrow} />
            </ListItemAvatar>
          )}
        </ListItem>
      </List>
      <Divider variant="fullWidth" />

      {!downArrow ? (
        <List>
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
      ) : (
        <List className={classes.list_drawer}>
          <ListItem
            activeStyle={activeStyle}
            component={NavLink}
            exact
            to="/"
            onClick={toggleDrawer(false)}
            classes={{ root: classes.root_text }}
          >
            <HomeIcon />

            <ListItemText
              classes={{ primary: classes.primary }}
              primary="Home"
            ></ListItemText>
          </ListItem>
          <ListItem
            activeStyle={activeStyle}
            component={NavLink}
            exact
            to="/employees"
            onClick={toggleDrawer(false)}
            classes={{ root: classes.root_text }}
          >
            <PeopleIcon />

            <ListItemText
              classes={{ primary: classes.primary }}
              primary="Employees"
            ></ListItemText>
          </ListItem>
          <ListItem
            activeStyle={activeStyle}
            component={NavLink}
            exact
            to="/designations"
            onClick={toggleDrawer(false)}
            classes={{ root: classes.root_text }}
          >
            <WorkIcon />

            <ListItemText
              classes={{ primary: classes.primary }}
              primary="Designations"
            ></ListItemText>
          </ListItem>
        </List>
      )}
    </div>
  );

  return (
    <>
      <AppBar position="fixed" className={classes.root}>
        <IconButton className={classes.icons} onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          open={state}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {list()}
        </SwipeableDrawer>

        <div className={classes.title_container}>
          <Toolbar>
            <Typography variant="h6" component="h1">
              Admin Template
            </Typography>
          </Toolbar>
        </div>
      </AppBar>
    </>
  );
}

import { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { CssBaseline, createTheme, ThemeProvider } from "@material-ui/core";

import Header from "./component/Header";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import Home from "./pages/Home";
import Employees from "./pages/employees/List";
import CreateEmployee from "./pages/employees/Create";
import EditEmployee from "./pages/employees/Edit";
import Designations from "./pages/designations/List";
import CreateDesignation from "./pages/designations/Create";
import EditDesignation from "./pages/designations/Edit";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#482880",
      light: "#3c44b126",
      paper: "#fff",
      black: "#000",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
      paper: "#fff",
    },
  },
});

function App() {
  const storagetkn = !!JSON.parse(localStorage.getItem("loginUser"));

  const [token, setToken] = useState(false);

  const login = (tkn) => {
    setToken(tkn);
  };
  const logout = () => {
    setToken(false);
  };

  let isLogged;
  if (token || storagetkn) {
    isLogged = true;
  } else {
    isLogged = false;
  }

  let routes;

  if (isLogged) {
    routes = (
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/employees">
          <Employees />
        </Route>
        <Route exact path="/designations">
          <Designations />
        </Route>
        <Route path="/designations/create">
          <CreateDesignation />
        </Route>
        <Route path="/employees/create">
          <CreateEmployee />
        </Route>
        <Route path="/employees/:id/edit">
          <EditEmployee />
        </Route>
        <Route path="/designations/:id/edit">
          <EditDesignation />
        </Route>
        <Route>
          <Redirect from="*" to="/" />
        </Route>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/register">
          {isLogged ? <Redirect to="/login" /> : <Register />}
        </Route>
        <Route path="/login">
          <Login login={login} />
        </Route>
        <Route>
          <Redirect from="*" to="/login" />
        </Route>
      </Switch>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Header user={isLogged} logout={logout} />
      {routes}
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;

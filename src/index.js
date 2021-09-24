import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer position="top-center" autoClose={2000} />
      </BrowserRouter>
    </Provider>
  </React.Fragment>,
  document.getElementById("root")
);

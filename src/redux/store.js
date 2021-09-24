import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "../redux/usersApi";

const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDeaultMiddleware) =>
    getDeaultMiddleware().concat(usersApi.middleware),
});

export default store;

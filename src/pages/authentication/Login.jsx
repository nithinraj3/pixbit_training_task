import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Container,
  Card,
  makeStyles,
  Avatar,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { useLoginMutation } from "../../redux/usersApi";
import LoadingSpinners from "../../component/LoadingSpinners";

const useStyles = makeStyles((theme) => ({
  main_container: {
    margin: theme.spacing(12, 0),
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  mobile_container: {
    marginTop: theme.spacing(12),
  },
}));

const validationSchema = Yup.object({
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string("Enter your password")
    .min(7, "Password should be of minimum 7 characters length")
    .required("Password is required"),
});

const Login = (props) => {
  const classes = useStyles();
  const [serverError, setServerError] = useState();
  const [viewPassword, setViewPassword] = useState(false);
  const history = useHistory();

  const handlePassword = () => {
    setViewPassword(!viewPassword);
  };

  const [login, { isLoading, error: loginError, isSuccess }] =
    useLoginMutation();

  if (isSuccess) {
    history.push("/");

    toast.success("Successfully logged...", {
      position: "top-center",
      autoClose: 1000,
    });
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (loginData) => {
      setServerError(true);
      try {
        const payload = await login(loginData);
        props.login(payload.data.data.access_token);
        history.push("/");
        localStorage.setItem(
          "loginUser",
          JSON.stringify(payload.data.data.access_token)
        );

        props.login(payload.data.data.access_token);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong, please try again!", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Login | Admin Template</title>
      </Helmet>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        className={classes.main_container}
      >
        <Card>
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <form
                className={classes.form}
                onSubmit={formik.handleSubmit}
                autoComplete="off"
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="email"
                      type="email"
                      label="E-mail Address"
                      value={formik.values.email}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setServerError(false);
                      }}
                      error={
                        (formik.touched.email &&
                          Boolean(formik.errors.email)) ||
                        (serverError && loginError?.data?.message)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="password"
                      label="Password"
                      type={viewPassword ? "text" : "password"}
                      id="password"
                      value={formik.values.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handlePassword} edge="end">
                              {viewPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setServerError(false);
                      }}
                      error={
                        (formik.touched.password &&
                          Boolean(formik.errors.password)) ||
                        (serverError && loginError?.data?.message)
                      }
                      helperText={
                        (formik.touched.password && formik.errors.password) ||
                        (serverError && loginError?.data?.message)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      fullWidth
                      startIcon={isLoading && <LoadingSpinners />}
                    >
                      {!isLoading && <Typography>Login</Typography>}
                    </Button>
                  </Grid>
                  <Grid item xs={12} style={{ marginLeft: "25%" }}>
                    <Link to="/register">
                      <p>Don't have an account? Sign Up</p>
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        </Card>
      </Grid>
    </>
  );
};

export default Login;

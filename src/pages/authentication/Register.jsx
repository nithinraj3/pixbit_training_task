import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Avatar,
  Button,
  CssBaseline,
  Container,
  Grid,
  TextField,
  Card,
  IconButton,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { useRegisterMutation } from "../../redux/usersApi";
import LoadingSpinners from "../../component/LoadingSpinners";

const useStyles = makeStyles((theme) => ({
  main_container: {
    marginTop: theme.spacing(12),
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    margin: theme.spacing(2, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  spinner: {
    marginLeft: theme.spacing(20),
  },
}));

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const validationSchema = Yup.object({
  name: Yup.string("Enter name").required("Name is required"),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string("Enter your password")
    .min(7, "Password should be of minimum 7 characters length")
    .matches(
      PASSWORD_REGEX,
      "Please enter a strong password, it must contain atleast single character, small and caps letter, with a number"
    )
    .required("Password is required"),
  password_confirmation: Yup.string("Enter your password")
    .min(7, "Password should be of minimum 7 characters length")
    .when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref("password")], "Password doesn't match"),
    })
    .required("Password is required"),
});

export default function Register() {
  const classes = useStyles();
  const history = useHistory();

  const [viewPassword, setViewPassword] = useState(false);
  const handlePassword = () => {
    setViewPassword(!viewPassword);
  };

  const [serverError, setServerError] = useState(false);

  const [register, { isLoading, error: registerError, isSuccess }] =
    useRegisterMutation();

  if (isSuccess) {
    toast.success("Successfully registered...", {
      position: "top-center",
      autoClose: 1000,
    });
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (registerData) => {
      setServerError(true);
      try {
        const payload = await register(registerData);

        localStorage.setItem(
          "registerUser",
          JSON.stringify(payload.data.data.access_token)
        );

        history.push("/login");
      } catch (error) {}
    },
  });

  return (
    <>
      <Helmet>
        <title>Register | Admin Template</title>
      </Helmet>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        className={classes.main_container}
      >
        <Card>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Register
              </Typography>

              <form
                className={classes.form}
                onSubmit={formik.handleSubmit}
                autoComplete="off"
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Username"
                  name="name"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setServerError(false);
                  }}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="E-mail Address"
                  name="email"
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setServerError(false);
                  }}
                  error={
                    formik.touched.email &&
                    Boolean(
                      formik.errors.email ||
                        (serverError && registerError?.data?.errors?.email)
                    )
                  }
                  helperText={
                    (formik.touched.email && formik.errors.email) ||
                    (serverError && registerError?.data?.errors?.email)
                  }
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type={viewPassword ? "text" : "password"}
                  id="password"
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setServerError(false);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handlePassword} edge="end">
                          {viewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={
                    (formik.touched.password &&
                      Boolean(formik.errors.password)) ||
                    (serverError && registerError?.data?.errors?.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password_confirmation"
                  label="Confirm Password"
                  type={viewPassword ? "text" : "password"}
                  id="password_confirmation"
                  value={formik.values.password_confirmation}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setServerError(false);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handlePassword} edge="end">
                          {viewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={
                    (formik.touched.password_confirmation &&
                      Boolean(formik.errors.password_confirmation)) ||
                    (serverError && registerError?.data?.errors?.password)
                  }
                  helperText={
                    (formik.touched.password_confirmation &&
                      formik.errors.password_confirmation) ||
                    (serverError &&
                      registerError?.data?.errors?.password &&
                      registerError?.data?.errors?.password[0])
                  }
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  startIcon={isLoading && <LoadingSpinners />}
                >
                  {!isLoading && <Typography>Register</Typography>}
                </Button>

                <div style={{ marginLeft: "25%" }}>
                  <Link to="/login">
                    <p>Already have an account? Login In</p>
                  </Link>
                </div>
              </form>
            </div>
          </Container>
        </Card>
      </Grid>
    </>
  );
}

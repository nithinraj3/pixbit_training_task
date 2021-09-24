import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  Container,
  makeStyles,
  Typography,
  Grid,
  Button,
  Paper,
  useMediaQuery,
} from "@material-ui/core";

import { useCreateDesignationMutation } from "../../redux/usersApi";
import TextField from "../../component/FormUI/Textfield";

const useStyles = makeStyles((theme) => ({
  main_container: {
    margin: theme.spacing(12, 2),
    padding: theme.spacing(0, 3, 3),
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(0, -3),
    padding: theme.spacing(3),
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    marginRight: theme.spacing(2),
  },
  form: {
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 2, 0, 0),
  },
  mobile_container: {
    margin: theme.spacing(12, 2),
    padding: theme.spacing(3),
  },
  mobile_wrapper: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2, -2, 3),
  },
  mobile_avatar: {
    backgroundColor: theme.palette.secondary.main,
    marginBottom: theme.spacing(1),
  },
  mobile_form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));
const Create = () => {
  const classes = useStyles();
  const history = useHistory();

  const FORM_VALIDATION = Yup.object().shape({
    designation_name: Yup.string().required("Required"),
  });

  const [createDesignation, { isError, error }] =
    useCreateDesignationMutation();

  if (isError) {
    toast.error(error?.data?.message, {
      position: "top-center",
      autoClose: 3000,
    });
  }

  const createDesignationHandler = async (values) => {
    const list = { designation_name: values.designation_name };

    try {
      await createDesignation(list);

      history.push("/designations");

      toast.success("Successfully added...", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (err) {}
  };

  const isDesktop = useMediaQuery("(min-width:730px)");

  return (
    <>
      <Helmet>
        <title>Create Designation | Admin Template</title>
      </Helmet>
      <Paper
        className={
          isDesktop ? classes.main_container : classes.mobile_container
        }
      >
        <Container
          className={isDesktop ? classes.wrapper : classes.mobile_wrapper}
        >
          {isDesktop ? (
            <Typography component="h1" variant="h6">
              Create Designation
            </Typography>
          ) : (
            <Typography
              style={{ fontSize: "20px" }}
              component="h1"
              variant="h6"
            >
              Create Designation
            </Typography>
          )}
        </Container>

        <Formik
          initialValues={{ designation_name: "" }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values) => createDesignationHandler(values)}
        >
          <Form className={classes.form} autoComplete="off">
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  name="designation_name"
                  label="Designation Name"
                />
              </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="flex-start">
              <Grid item>
                <Button
                  className={classes.submit}
                  xs={12}
                  sm={6}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={classes.submit}
                  xs={12}
                  sm={6}
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => history.push("/designations")}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Paper>
    </>
  );
};

export default Create;

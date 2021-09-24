import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  Typography,
  makeStyles,
  Grid,
  Button,
  Paper,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {
  useCreateEmployeeMutation,
  useGetDesignationsQuery,
} from "../../redux/usersApi";
import TextField from "../../component/FormUI/Textfield";
import RadioGender from "../../component/FormUI/RadioGender";
import Select from "../../component/FormUI/Select";
import FileInput from "../../component/FormUI/FileField";
import DateTime from "../../component/FormUI/DateTimePicker";
import AddressCheckboxField from "../../component/FormUI/AddressCheckboxField";

const useStyles = makeStyles((theme) => ({
  main_container: {
    margin: theme.spacing(12, 2),
    padding: theme.spacing(0, 3),
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(0, -3),
    padding: theme.spacing(3),
  },
  text_field: {
    marginBottom: theme.spacing(4),
  },
  gender: {
    marginBottom: theme.spacing(3),
  },
  button_container: {
    margin: theme.spacing(-1, 0, 3, -1),
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
  mobile_text_field: {
    marginBottom: theme.spacing(3),
  },
  mobile_gender: {
    marginBottom: theme.spacing(3),
  },
  mobile_button_container: {
    margin: theme.spacing(0, 0, 1, -1),
  },
}));

const INITIAL_FORM_STATE = {
  first_name: "",
  last_name: "",
  mobile: "",
  landline: "",
  email: "",
  join_date: null,
  date_of_birth: null,
  status: "",
  gender: "",
  profile_picture: null,
  resume: null,
  present_address: "",
  permanent_address: "",
  designation_id: "",
  addressCheckBox: false,
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FORM_VALIDATION = Yup.object().shape({
  first_name: Yup.string().required("First name required"),
  last_name: Yup.string().required("Last name required"),
  email: Yup.string()
    .nullable()
    .email("Email is  invalid")
    // .matches(emailRegex, "Email is not valid"),
    .required("Email required"),
  mobile: Yup.string()
    .matches(phoneRegExp, "Mobile number is not valid")
    .required("Mobile number required"),
  landline: Yup.string().matches(phoneRegExp, "Landline number is not valid"),
  join_date: Yup.date()
    .nullable()
    .typeError("date must be in DD/MM/YYYY format")
    .required("Joining Date required"),
  date_of_birth: Yup.date()
    .nullable()
    .typeError("date must be in DD/MM/YYYY format")
    .required("Date of birth required"),
  gender: Yup.string().nullable().required("Please select a gender"),
  present_address: Yup.string().required("Present Address required"),
  permanent_address: Yup.string().required("Permanent Address required"),
  designation_id: Yup.string().nullable().required("Designation required"),
  status: Yup.string().required("Status required"),
  profile_picture: Yup.mixed().required("Profile picture required"),
  resume: Yup.mixed().required("Resume required"),
});

const Create = () => {
  const history = useHistory();
  const classes = useStyles();
  const { data, isSuccess: designationSuccess } = useGetDesignationsQuery();
  const [designationData, setDesignationData] = useState([]);

  useEffect(() => {
    if (designationSuccess) {
      setDesignationData(data.data);
    }
  }, [data, designationSuccess]);

  const [createEmployee, { isSuccess, error, isError: employeeError }] =
    useCreateEmployeeMutation();

  if (isSuccess) {
    history.push("/employees");

    toast.success("Successfully added...", {
      position: "top-center",
      autoClose: 1000,
    });
  }

  if (employeeError) {
    console.log("error", error);
  }

  const isDesktop = useMediaQuery("(min-width:730px)");

  return (
    <>
      <Helmet>
        <title>Create Employee | Admin Template</title>
      </Helmet>
      <Paper
        className={
          isDesktop ? classes.main_container : classes.mobile_container
        }
      >
        <Container
          className={isDesktop ? classes.wrapper : classes.mobile_wrapper}
        >
          <Typography component="h1" variant="h6">
            Create Employee
          </Typography>
        </Container>
        <Formik
          initialValues={{
            ...INITIAL_FORM_STATE,
          }}
          validationSchema={FORM_VALIDATION}
          validateOnChange
          onSubmit={async (values, { setFieldError }) => {
            const formData = new FormData();
            formData.append("first_name", values.first_name);
            formData.append("last_name", values.last_name);
            formData.append(
              "join_date",
              new Date(values.join_date).toLocaleDateString("zh-Hans-CN")
            );
            formData.append(
              "date_of_birth",
              new Date(values.date_of_birth).toLocaleDateString("zh-Hans-CN")
            );
            formData.append("designation_id", values.designation_id);
            formData.append("gender", values.gender);
            formData.append("status", values.status);
            formData.append("email", values.email);
            formData.append("mobile", values.mobile);
            formData.append("landline", values.landline);
            formData.append("present_address", values.present_address);
            formData.append("permanent_address", values.permanent_address);
            formData.append(
              "profile_picture",
              values.profile_picture,
              values.profile_picture?.name || ""
            );
            formData.append("resume", values.resume, values.resume?.name);
            try {
              var res = await createEmployee(formData);
              console.log(res);
              if (Boolean(res?.error?.data?.errors?.profile_picture)) {
                setFieldError(
                  "profile_picture",
                  res?.error?.data?.errors?.profile_picture[1]
                );
              }
              if (Boolean(res?.error?.data?.errors?.resume)) {
                setFieldError("resume", res?.error?.data?.errors?.resume[0]);
              }
              if (Boolean(res?.error?.data?.errors?.email)) {
                setFieldError("email", res?.error?.data?.errors?.email[0]);
              }
            } catch (err) {}
          }}
        >
          <Form autoComplete="off">
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="first_name"
                  label="First Name"
                />
                <TextField
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="last_name"
                  label="Last Name"
                />
                <TextField
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="email"
                  label="Email"
                />

                <TextField
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="mobile"
                  label="Mobile"
                />
                <TextField
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="landline"
                  label="Landline"
                />
                <DateTime
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  autoOk={true}
                  name="join_date"
                  label="Joining Date"
                />
                <DateTime
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  autoOk={true}
                  name="date_of_birth"
                  label="Date of Birth"
                />
                <Select
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="designation_id"
                  label="Designation"
                  options={designationData}
                />
                <Select
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  label="Status"
                  name="status"
                  options={[
                    { id: "1", name: "Temporary" },
                    { id: "2", name: "Trainee" },
                    { id: "3", name: "Permanent" },
                  ]}
                />
                <RadioGender
                  className={isDesktop ? classes.gender : classes.mobile_gender}
                  row
                  name="gender"
                />
                <TextField
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="present_address"
                  label="Present Address"
                  multiline
                  rows={3}
                />
                <div style={{ marginBottom: "1.5rem" }}>
                  <AddressCheckboxField />
                </div>
                <TextField
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="permanent_address"
                  label="Permenent Address"
                  multiline
                  rows={3}
                />
                <FileInput
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="profile_picture"
                  label="Profile Picture"
                />
                <FileInput
                  className={
                    isDesktop ? classes.text_field : classes.mobile_text_field
                  }
                  name="resume"
                  label="Resume"
                />

                <Grid
                  container
                  spacing={2}
                  className={
                    isDesktop
                      ? classes.button_container
                      : classes.mobile_button_container
                  }
                >
                  <Grid item>
                    <Button type="submit" color="primary" variant="contained">
                      Submit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="secondary"
                      variant="outlined"
                      component="label"
                      onClick={() => history.push("/employees")}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Paper>
    </>
  );
};

export default Create;

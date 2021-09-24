import React from "react";
import { TextField } from "@material-ui/core";
import { useField, useFormikContext } from "formik";

const TextfieldWrapper = ({ name, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return <TextField {...configTextfield} />;
};

export default TextfieldWrapper;

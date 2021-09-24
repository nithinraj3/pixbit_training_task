import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { useField, useFormikContext } from "formik";

const DateTimePicker = ({ name, label, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event) => {
    setFieldValue(name, event);
  };

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    onChange: handleChange,
    label,
    fullWidth: true,
    variant: "inline",
    inputVariant: "outlined",
    format: "dd/MM/yyyy",
    KeyboardButtonProps: {
      "aria-label": "change date",
    },
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker {...configDateTimePicker} />
      </MuiPickersUtilsProvider>
    </>
  );
};

export default DateTimePicker;

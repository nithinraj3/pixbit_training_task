import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { useField, useFormikContext } from "formik";

const RadioForm = ({ name, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();

  const [field, meta] = useField(name);

  const handleChange = (e) => {
    const { value } = e.target;
    setFieldValue(name, value);
  };

  const configRadio = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  return (
    <>
      <FormControl fullWidth component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup {...configRadio}>
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
        </RadioGroup>
        {meta.error && (
          <FormHelperText style={{ color: "red", margin: " -20px 10px 20px" }}>
            {meta.error}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};

export default RadioForm;

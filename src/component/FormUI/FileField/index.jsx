import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useField, useFormikContext } from "formik";
import { useRef } from "react";
const FileInput = ({ name, ...otherProps }) => {
  const fileInputEl = useRef();
  const { setFieldValue, values } = useFormikContext();

  const [field, meta] = useField(name);
  const handleChange = (e) => {
    if (!e?.target?.files) {
      return;
    }
    setFieldValue(name, e.target.files[0]);
  };

  const configFile = {
    ...field,
    ...otherProps,
    fullWidth: true,
    onChange: handleChange,
  };
  if (meta && meta.touched && meta.error) {
    configFile.error = true;
    configFile.helperText = meta.error;
  }

  return (
    <>
      <TextField
        {...configFile}
        value={
          name === "profile_picture"
            ? values.profile_picture?.name || ""
            : values.resume?.name || ""
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  fileInputEl.current.click();
                }}
                edge="end"
              >
                <AttachFileIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />

      <input
        type="file"
        // required
        // label={label}
        name={name}
        ref={fileInputEl}
        style={{ width: "0", height: "0" }}
        onChange={handleChange}
        hidden
      />
    </>
  );
};

export default FileInput;

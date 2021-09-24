import { Checkbox, FormControlLabel } from "@material-ui/core";
import { useField, useFormikContext } from "formik";

const AddressCheckBox = () => {
  const [field] = useField({ name: "addressCheckBox", type: "checkbox" });

  const { setFieldValue, values } = useFormikContext();

  const addressBox = values.addressCheckBox;

  const checkBoxAddressChange = () => {
    setFieldValue("addressCheckBox", !addressBox);

    if (!addressBox) {
      setFieldValue("permanent_address", values?.present_address);
    } else {
      setFieldValue("permanent_address", "");
    }
  };
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            onChange={checkBoxAddressChange}
            checked={values.addressCheckBox}
            color="primary"
          />
        }
        label="Same as present Address"
      />
    </div>
  );
};

export default AddressCheckBox;

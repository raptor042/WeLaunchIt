import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./styles.module.scss";

type Props = {
  value: string;
  isChecked?: boolean;
  name: string;
  isDisabled?: boolean;
  setCheck?: Function;
};
const CheckBoxComponent: React.FC<Props> = memo<Props>(
  ({ value, name, setCheck, isChecked, isDisabled }) => (
    <div
      className={clsx(styles.checkboxRoot, isDisabled ? styles.disabled : "")}
    >
      <input
        onChange={() => (setCheck ? setCheck(!isChecked) : "")}
        type="checkbox"
        id={name.toLowerCase()}
        name={name.toLowerCase()}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
      />
      <label htmlFor={name.toLowerCase()}>{value}</label>
    </div>
  )
);

CheckBoxComponent.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  setCheck: PropTypes.func
};

CheckBoxComponent.displayName = "CheckBoxComponent";

export default CheckBoxComponent;

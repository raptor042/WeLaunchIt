import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./styles.module.scss";

type Props = {
  options: string[];
  name: string;
  isChecked?: boolean;
  defaultItem?: string;
};
const RadioGroupComponent: React.FC<Props> = memo<Props>(
  ({ name, options, defaultItem, isChecked }) => (
    <div className={styles.radioGroupRoot}>
      {options.map((item, index) => (
        <div key={name + index}>
          <input
            type="radio"
            id={item.toLowerCase()}
            name={name}
            value={item}
            checked={defaultItem === item ? true : false}
          />
          <label htmlFor={item.toLowerCase()}>{item}</label>
        </div>
      ))}
    </div>
  )
);

RadioGroupComponent.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  name: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  defaultItem: PropTypes.string
};

RadioGroupComponent.displayName = "RadioGroupComponent";

export default RadioGroupComponent;

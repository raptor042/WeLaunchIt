import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";
import { isNumberObject } from "util/types";

type Props = {
  value: string | number;
  setValue?: Function;
  placeholder?: string;
  max?: number;
  min?: number;
  step?: number;
  readonly?: boolean;
  number?: boolean;
  warned?: boolean;
  message?: string;
  pattern?: string;
  validator?: (_: string) => boolean;
};

const TextFieldComponent: React.FC<Props> = memo<Props>(
  ({
    value,
    setValue,
    placeholder,
    readonly,
    number,
    min = 0,
    max = 0xffffff,
    warned,
    message,
    step = 1,
    pattern,
    validator = (_: string) => true
  }) => (
    <div className="tw-relative">
      <input
        className={clsx(
          styles.textFieldRoot,
          warned ||
            (number &&
              Number(value) !== 0 &&
              (Number(value) < min || Number(value) > max)) ||
            (value !== "" && !validator(value.toString() || ""))
            ? styles.warned
            : "",
          readonly ? styles.readonly : ""
        )}
        value={number ? undefined : value}
        onChange={(event) =>
          setValue
            ? setValue(number ? Number(event.target.value) : event.target.value)
            : ""
        }
        placeholder={placeholder}
        readOnly={readonly}
        type={number ? "number" : "text"}
        step={number ? step : ""}
        max={number ? max : ""}
        min={number ? min : ""}
        pattern={pattern}
      />
      {message ? <p className={styles.message}>* {message}</p> : ""}
    </div>
  )
);

TextFieldComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
  number: PropTypes.bool,
  warned: PropTypes.bool,
  message: PropTypes.string,
  pattern: PropTypes.string,
  validator: PropTypes.func
};

TextFieldComponent.displayName = "TextFieldComponent";

export default TextFieldComponent;

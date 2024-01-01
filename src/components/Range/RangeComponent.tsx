import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";

type Props = {
  value: number;
  setValue?: Function;
  amount?: number;
  minValue: number;
  maxValue: number;
  step: number;
};

const RangeComponent: React.FC<Props> = memo<Props>(
  ({ value, setValue, amount, minValue, maxValue, step }) => (
    <div className={styles.rangeRoot}>
      <input
        type="range"
        name="volume"
        value={value}
        min={minValue}
        max={maxValue}
        step={step}
        onChange={(event) =>
          setValue ? setValue(Number(event.target.value)) : ""
        }
      />
      <label>
        <div>{value}%</div>
      </label>
      {/* { amount !== undefined ? <span>{(value/3).toFixed(1)}</span> : "" } */}
    </div>
  )
);

RangeComponent.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func,
  amount: PropTypes.number,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired
};

RangeComponent.displayName = "RangeComponent";

export default RangeComponent;

import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./styles.module.scss";

type Props = {
  value: string;
  subValue?: string;
  required?: boolean;
};
const LabelComponent: React.FC<Props> = memo<Props>(
  ({ value, subValue, required }) => (
    <div className={styles.labelRoot}>
      {value}
      {required && <span className="tw-text-[#d63939] tw-ml-1">*</span>}
      {subValue !== undefined ? (
        <span className="tw-text-greyM tw-font-regular tw-text-xs tw-ml-1">
          {subValue}
        </span>
      ) : (
        ""
      )}
    </div>
  )
);

LabelComponent.propTypes = {
  value: PropTypes.string.isRequired,
  subValue: PropTypes.string,
  required: PropTypes.bool
};

LabelComponent.displayName = "LabelComponent";

export default LabelComponent;

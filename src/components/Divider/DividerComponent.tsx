import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";

type Props = {
  value: string;
};

const DividerComponent: React.FC<Props> = memo<Props>(({ value }) => (
  <div className={styles.dividerRoot}>
    <p>{value}</p>
  </div>
));

DividerComponent.propTypes = {
  value: PropTypes.string.isRequired
};

DividerComponent.displayName = "DividerComponent";

export default DividerComponent;

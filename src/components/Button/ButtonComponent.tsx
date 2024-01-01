import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";

type Props = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const ButtonComponent: React.FC<Props> = memo<Props>(
  ({ children, className, onClick }) => (
    <div
      className={clsx(className, styles.buttonRoot)}
      onClick={() => onClick && onClick()}
    >
      <span>{children}</span>
    </div>
  )
);

ButtonComponent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  onClick: PropTypes.func
};

ButtonComponent.displayName = "ButtonComponent";

export default ButtonComponent;

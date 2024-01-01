import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { exitMark } from "@dex/constants/svg_icons";
import styles from "./styles.module.scss";

type Props = {
  title: string;
  content: string;
};

const AlertComponent: React.FC<Props> = memo<Props>(({ title, content }) => {
  const [showFlag, setShowFlag] = useState(true);
  return (
    <div className={clsx(styles.alertRoot, showFlag ? "" : "tw-hidden")}>
      <div className={styles.titleText}>{title}</div>
      <div className={styles.contentText}>{content}</div>
      <span
        className={styles.exitButton}
        onClick={() => setShowFlag(!showFlag)}
      >
        {exitMark}
      </span>
    </div>
  );
});

AlertComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

AlertComponent.displayName = "AlertComponent";

export default AlertComponent;

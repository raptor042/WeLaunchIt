import React, { memo } from "react";
import clsx from "clsx";

import { downArrowMark } from "@dex/constants/svg_icons";

import styles from "./styles.module.scss";

type Props = {
  value: string;
  setValue?: Function;
  options?: { [key: number]: string };
  isDisabled?: boolean;
};

const SelectComponent: React.FC<Props> = memo<Props>(
  ({ value, setValue, options, isDisabled }) => (
    <div className="tw-relative">
      <select
        className={clsx(styles.selectRoot, isDisabled ? styles.disabled : "")}
        value={value}
        onChange={(event) => (setValue ? setValue(event.target.value) : "")}
        disabled={isDisabled}
      >
        {Object.getOwnPropertyNames(options).map(
          (item: string, index: number) => (
            <option key={"select" + index + item} value={item}>
              {options![Number(item)]}
            </option>
          )
        )}
      </select>
      <span className="tw-absolute tw-top-5 tw-right-3 tw-z-0">
        {downArrowMark}
      </span>
    </div>
  )
);

SelectComponent.displayName = "SelectComponent";

export default SelectComponent;

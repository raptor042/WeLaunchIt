import React, { memo } from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  value: string;
};

const NavBarComponent: React.FC<Props> = memo<Props>(({ value }) => (
  <div className={styles.navBarRoot}>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/"}>Deploy</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/edit_contract" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/edit_contract"}>Edit Contract</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/lock" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/lock"}>Lock</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/locks" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/locks"}>Locks</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/edit_lock" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/edit_lock"}>Edit/Unlock</Link>
    </div>
  </div>
));

NavBarComponent.propTypes = {
  value: PropTypes.string.isRequired
};

NavBarComponent.displayName = "NavBarComponent";

export default NavBarComponent;

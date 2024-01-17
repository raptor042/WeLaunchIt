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
        <Link href={"/"}>Contract Factory</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/pair" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/pair"}>Pair</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/lock" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/lock"}>Lock</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/locks" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/locks"}>Locks</Link>
    </div>
    <div className={clsx("tw-flex", "hover:tw-opacity-80", value == "/edit" ? "tw-text-[#06A95C]" : "tw-text-greyD", "tw-justify-center", "tw-font-semi-bold", "tw-text-md")}>
        <Link href={"/edit"}>Edit/Unlock</Link>
    </div>
  </div>
));

NavBarComponent.propTypes = {
  value: PropTypes.string.isRequired
};

NavBarComponent.displayName = "NavBarComponent";

export default NavBarComponent;

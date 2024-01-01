import { twitterMark, telegramMark } from "@dex/constants/svg_icons";
import styles from "./styles.module.scss";

const FooterView = () => {
  return (
    <div className={styles.footerRoot}>
      <div className="tw-container tw-m-auto tw-p-5 tw-flex tw-justify-between">
        <div>Copyright © 2023 We Launch It.</div>
        {/* <div className={styles.footerLink}>
                    <a href='#'>
                        {twitterMark}
                    </a>
                    <a href='https://t.me/wedeployit' target='blank'>
                        {telegramMark}
                    </a>
                    <a href='#'>Terms</a>
                    <a href='#'>Contracts</a>
                </div> */}
      </div>
    </div>
  );
};

export default FooterView;

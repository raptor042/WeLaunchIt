import LockInfoContainer from "@dex/modules/LockInfo/containers/LockInfoContainer";
import LockContractContainer from "@dex/modules/LockContract/containers/LockContractContainer";
import FooterContainer from "@dex/modules/Footer/FooterContainer/FooterContainer";

import styles from "../page.module.scss";
import { useRouter } from "next/router";
import NavBarComponent from "@dex/components/NavBar/NavBarComponent";

export default function LockPage() {
    const router = useRouter()
    const { address } = router.query

    return (
        <>
            <div className={styles.root}>
                <div className={styles.topText}>
                <span className="tw-font-bold">We Launch It:</span>&nbsp;
                <span>Lock your BEP20 or ERC20 token for free.</span>&nbsp;
                <span>
                    <a href="https://youtu.be/DKQtjzMgG2k" className="tw-font-semi-bold">
                    Click here
                    </a>{" "}
                    to watch our tutorial on how you can lock a BEP20 or ERC20 token
                    for free.<br></br>
                    <span className="tw-font-bold">Partnership:</span>&nbsp; Make A Crypto Website For Free With <a href="https://t.me/WebsiteAIBot" className="tw-font-semi-bold">WebsiteAIBot</a>{" "}
                </span>
                </div>
                <div className="tw-w-full">
                    <NavBarComponent value="/locks" />
                </div>
                <div className={styles.mainRoot}>
                    <div className="md:tw-w-full md:tw-flex-[20%]"></div>
                    <div className="tw-w-full tw-flex-grow">
                        <LockInfoContainer address={address as string} />
                    </div>
                    <div className="md:tw-w-full md:tw-flex-[20%]"></div>
                {/* <div className={styles.telegram}>
                    <a href="https://t.me/welaunchit" target="blank">
                    {telegramMark}
                    </a>
                </div> */}
                </div>
                <FooterContainer />
            </div>
        </>
    )
}
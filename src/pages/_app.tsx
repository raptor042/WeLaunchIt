import type { AppProps } from "next/app";

import Providers from "@dex/modules/Providers";
import "@dex/styles/globals.scss";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>We Launch It</title>
        <link rel="icon" href="favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </Providers>
  );
}

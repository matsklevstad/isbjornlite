import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MantineProvider>
        <Head>
          <title>Isbjørn Lites venner </title>
          <meta
            name="description"
            content="Et samfunn for alle som elsker Isbjørn Lite i ulike fasonger"
          />
        </Head>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}

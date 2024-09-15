import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Isbjørn Lites venner | 🍺🐻‍❄️</title>
        <meta
          name="description"
          content="Et samfunn for alle som elsker Isbjørn Lite i ulike fasonger"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

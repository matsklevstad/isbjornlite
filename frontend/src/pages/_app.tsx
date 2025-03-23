import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthInitializer from "@/components/AuthInitializer";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Head>
            <title>Isbjørn Lites venner </title>
            <meta
              name="description"
              content="Et samfunn for alle som elsker Isbjørn Lite i ulike fasonger"
            />
          </Head>
          <AuthInitializer />
          {/* MantineProvider can be customized here */}
          <Component {...pageProps} />
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}

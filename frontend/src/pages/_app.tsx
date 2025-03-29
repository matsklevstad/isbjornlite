import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import AuthInitializer from "@/components/AuthInitializer";
import { useState } from "react";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  colors: {
    isbjorn: [
      "#e5f9ff",
      "#d0eeff",
      "#9fdbfd",
      "#6dc7fb",
      "#47b6fa",
      "#34abfa",
      "#27a6fb",
      "#1991e0",
      "#0081ca",
      "#006fb2",
    ],
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <MantineProvider theme={theme} defaultColorScheme="dark">
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
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}

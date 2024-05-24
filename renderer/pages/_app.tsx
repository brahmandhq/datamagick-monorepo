import { useEffect } from "react";
import "react-data-grid/lib/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

import { NextUIProvider, createTheme } from "@nextui-org/react";
import Cookies from "universal-cookie";

import "../styles/globals.css";

const { v4: uuidv4 } = require("uuid");

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout || ((page) => page);

  // const lightTheme = createTheme({
  //     type: 'light',
  //     theme: {
  //         colors: {},
  //     },
  // });

  const darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: {},
    },
  });

  useEffect(() => {
    const cookies = new Cookies();
    const hello = cookies.get("myCat");
    if (!hello) {
      const uuid = uuidv4();
      cookies.set("hello", uuid, {
        path: "/",
        sameSite: "lax",
      });
    }
  }, []);

  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>DataMagick | The Essential Database Tool</title>
        </Head>
        <NextThemesProvider
          defaultTheme="dark"
          attribute="class"
          value={{
            // light: lightTheme.className,
            dark: darkTheme.className,
          }}
        >
          <NextUIProvider>
            {getLayout(
              <>
                <ToastContainer />
                <NextNProgress />
                <Component {...pageProps} />
              </>
            )}
          </NextUIProvider>
        </NextThemesProvider>
      </SessionProvider>
      <SpeedInsights />
    </>
  );
}

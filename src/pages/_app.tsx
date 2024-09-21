import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LDProvider } from "@/components/ldprovider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LDProvider>
      <Component {...pageProps} />
    </LDProvider>
  );
}

export default MyApp;

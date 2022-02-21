import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "../components/header";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Header props={session} />
      <div className="p-2">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;

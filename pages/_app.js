import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

function MyApp({ Component, pageProps: { session, ...pageProps }, router }) {
  return (
    <SessionProvider session={session}>
      <main className="">
        <Header props={session} />
        <motion.div
          key={router.route}
          initial="initial"
          animate="animate"
          variants={{
            initial: {
              opacity: 0.5,
            },
            animate: {
              opacity: 1,
            },
          }}
        >
          <div className="mt-10 p-2 relative ">
            <Component {...pageProps} />
          </div>
        </motion.div>
        <Footer />
      </main>
    </SessionProvider>
  );
}

export default MyApp;

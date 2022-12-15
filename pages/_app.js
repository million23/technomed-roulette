import "../styles/globals.css";

import { ParticipantsWrapper } from "../components/ParticipantsContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ParticipantsWrapper>
        <main className="flex justify-center">
          <div className="w-full max-w-xl">
            <Component {...pageProps} />
          </div>
        </main>
      </ParticipantsWrapper>
    </>
  );
}

export default MyApp;

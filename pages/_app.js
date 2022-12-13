import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <main className="flex justify-center">
        <div className="w-full max-w-xl">
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
}

export default MyApp;

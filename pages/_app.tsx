import Head from 'next/head'

import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import '../styles/index.css'
import Footer from '@/components/footer'
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const body = document.querySelector('body');
    
    body.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    }, false);

    disableBodyScroll(body);

    return () => {
      clearAllBodyScrollLocks();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Yi's Website</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" />
        <meta name="HandheldFriendly" content="true" />
      </Head>
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp

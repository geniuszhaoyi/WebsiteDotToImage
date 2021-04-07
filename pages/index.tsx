import Head from 'next/head';
import CanvasFileWrapper from '@/components/canvasFileWrapper';
import Footer from '@/components/footer';

import classes from './style.module.scss';
import { useState, useEffect } from 'react';
import SideButtons from '@/components/sideButtons';

const IndexPage = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [overrideDeviceLimit, setOverrideDeviceLimit] = useState(false);

  const [started, setStarted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleWindowSizeChange = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    setSize({ width: window.innerWidth, height: window.innerHeight });
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const start = () => {
    setStarted(true);
    setTimeout(() => {
      var x = document.getElementById("myAudio") as any;
      x.currentTime = 1.8;
      x.play();
    }, 0);
  }

  const isMobile = false;
  // const isMobile: boolean = (size.width <= 768 || size.height < 850);

  const isTouchDevice = size.width > 768 && (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);

  const head = <Head>
    <title>Happy Birthday to Daidai!!!</title>
  </Head>

  if (!overrideDeviceLimit && (isMobile || isTouchDevice)) {
    return <>
      {head}
      <div className={classes.imageContainer}>
        <div className={classes.mobile}>
          <div>For best performance, please open with Chrome/Firefox in non-touch-screen device.</div>
          <br />
          <div className={classes.overrideDeviceLimit} onClick={() => { setOverrideDeviceLimit(true); start(); }}>Take me to the page anyway</div>
        </div>
      </div>
    </>
  }

  const onRevealFullImage = () => {
    setShowAll(true);
  }

  return <>
    {head}
    <div className={classes.starter} onClick={start} style={{ display: started ? 'none' : '' }}>
      <img src="https://website-happybirthday-images.s3.us-east-2.amazonaws.com/drag.jpg"></img>
      <div>Drag mouse to reveal image</div>
      <div>Click to start</div>
    </div>
    <audio id="myAudio" src="https://website-happybirthday-images.s3.us-east-2.amazonaws.com/HappyBirthdayJazz.mp3" loop autoPlay></audio>
    <div className={classes.imageContainer}>
      <CanvasFileWrapper imageId={'index'} showAll={showAll} />
    </div>
    <SideButtons onRevealFullImage={onRevealFullImage} />
    <Footer>
      <div className={classes.footer}>
        Made by <span>Yi Zhao</span> for <span>Lu Yu</span> / Happy Birthday 2021! / Powered by <span><a href="https://d3js.org/">D3</a></span>
      </div>
    </Footer>
  </>
}

export default IndexPage;
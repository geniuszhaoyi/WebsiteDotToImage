import ImageBoard from '../components/imageBoard';
import Head from 'next/head';

const ImageWrapper = () => {
  return <>
    <Head>
      <title>Happy Birthday to Daidai!!!</title>
    </Head>
    <ImageBoard imageId={'index'} />
  </>
}

export default ImageWrapper;
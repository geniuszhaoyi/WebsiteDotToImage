import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import Canvas from '@/components/canvas';

import classes from './style.module.scss';

const ImageBoard = ({ imageId }) => {
  const [imageFile, setImageFile] = useState<Blob>();

  useEffect(() => {
    (async () => {
      if (imageId) {
        const image = await fetch(`/api/image-metadata/${imageId}`).then((res) => res.json());

        if (image && image.objectURL) {
          const blob = await fetch(image.objectURL).then(res => res.blob());
          setImageFile(blob);
        }
      }
    })()
  }, [imageId]);

  if (imageFile) {
    return <div className={classes.imageContainer}>
      <Canvas file={imageFile}></Canvas>
    </div>
  } else {
    return <div></div>
  }
}

export default ImageBoard;
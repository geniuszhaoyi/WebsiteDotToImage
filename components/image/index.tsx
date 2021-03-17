import { useState, useEffect } from 'react';

import { useImage } from '@/lib/swr-hooks';
import Canvas from '@/components/canvas-based-canvas';

import classes from './style.module.scss';

const ImageBoard = ({ imageId }) => {
  const image = useImage(imageId);

  const [imageFile, setImageFile] = useState<Blob>();

  useEffect(() => {
    if (image && image.objectURL) {
      fetch(image.objectURL)
        .then(res => res.blob())
        .then(blob => {
          setImageFile(blob);
        });
    }
  }, [image]);

  if (imageFile) {
    return <div className={classes.imageContainer}>
      <Canvas file={imageFile}></Canvas>
    </div>
  } else {
    return <div></div>
  }
}

export default ImageBoard
import { useState, useEffect } from 'react';

import Canvas from '@/components/canvas';

import classes from './style.module.scss';

const ImageBoard = ({ imageId }) => {
  const [imageFile, setImageFile] = useState<Blob>();

  useEffect(() => {
    (async () => {
      if (imageId) {
        const blob = await fetch(`/api/image/${imageId}`).then(res => res.blob());
        setImageFile(blob);
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
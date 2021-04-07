import { useState, useEffect } from 'react';

import Canvas from '@/components/canvas';

const CanvasFileWrapper = ({ imageId, showAll=false }) => {
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
    return <Canvas file={imageFile} showAll={showAll}></Canvas>
  } else {
    return <div></div>
  }
}

export default CanvasFileWrapper;
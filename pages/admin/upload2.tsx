import { useState, useEffect } from 'react'
import Canvas from '@/components/canvas-based-canvas';

export default function IndexPage() {

  const [file, setFile] = useState();

  const onFileChange = (event: any) => {
    setFile(event.target.files[0]);
  }

  return (
    <div>
      <input type="file" onChange={onFileChange} accept="image/*" />
      <Canvas file={file}></Canvas>
    </div>
  )
}

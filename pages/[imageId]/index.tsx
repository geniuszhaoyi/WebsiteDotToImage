import { useRouter } from 'next/router'

import ImageBoard from '../../components/imageBoard';

const ImageWrapper = () => {
  const router = useRouter()
  const imageId = router.query.imageId?.toString();

  return <ImageBoard imageId={imageId} />
}

export default ImageWrapper
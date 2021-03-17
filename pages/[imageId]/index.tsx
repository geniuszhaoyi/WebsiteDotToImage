import { useRouter } from 'next/router'

import ImageBoard from '../../components/image';

const ImageWrapper = () => {
  const router = useRouter()
  const imageId = router.query.imageId?.toString();

  return <ImageBoard imageId={imageId} />
}

export default ImageWrapper
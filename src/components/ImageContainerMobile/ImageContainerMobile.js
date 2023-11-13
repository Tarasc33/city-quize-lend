import Image from "next/image"

const ImageContainerMobile = () => {
  return (
    <div className="img-background-mobile">
      <Image
        src="/mobile.webp"
        alt="ukraine future"
        className='image'
        fill
        style={{margin: '0 auto', opacity: 0.9}}
        priority
      />
    </div>
  )
}

export default ImageContainerMobile

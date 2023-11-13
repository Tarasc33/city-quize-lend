import {TagCloud} from "@frank-mayer/react-tag-cloud"

const CloudWish = ({dimensions, dataCloud}) => {
  return (
    <TagCloud
      options={(w) => ({
        radius: Math.min(dimensions.width, w.innerWidth, w.innerHeight) / 2,
        useHTML: true,
        keep: false,
        direction: 0
      })}
      onClickOptions={{passive: true}}
    >
      {dataCloud?.map((item) => {
        if (item.status) {
          return `<span data-weight="${item.sizeTitle}" style="text-shadow: 1px 1px 1px ${item.color}; font-style: ${item.fontStyle ? item.fontStyle : 'normal'};" data-id="${item.id}">${item.title}</span>`
        } else {
          return null
        }
      })}
    </TagCloud>
  )
}

export default CloudWish

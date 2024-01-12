import React, { useEffect } from "react"
import { Breadcrumbs, Item } from "@adobe/react-spectrum"
import { navigate } from "gatsby"

const secondFlex = {
  margin: ".5em 0 .5em 0",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "row",
  position: "relative",
  left: "-12px",
  flexWrap: "wrap",
}
const inlineFlex = {
  display: "inline-flex",
  alignItems: "baseline",
  flexWrap: "nowrap",
}

const BreadcrumbV2 = ({ url, name }) => {

  let [folderUrl, setFolderUrl] = React.useState(null);

  const reg = new RegExp(/(?<!-)(?<!f)\//)
  const urlArr = url.split(reg).slice(1, -1)
  let temp = ""
  urlArr.map((item, index) => {
    var item = item.split("/")
    var result = item[item.length - 1]
    temp = temp + "/" + item
    if (index === urlArr.length - 1) {
      urlArr[index] = { link: temp, name: name }
    } else {
      urlArr[index] = { link: temp, name: result }
    }
  })
  urlArr.shift()

  useEffect(() => {
    navigate(folderUrl)
  }, [folderUrl])

  return (
    <div style={{marginTop: "1em"}}>
      <Breadcrumbs onAction={setFolderUrl} size="S">
        <Item  key="/">Home</Item>
        {urlArr.map(item => (
          <Item  key={item.link}>
            {item.name}
          </Item>
        ))}
      </Breadcrumbs>
    </div>
  )
}

export default BreadcrumbV2

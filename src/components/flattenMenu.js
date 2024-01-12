const FlattenMenu = menuData => {
  const fixedMenu = []

  const fix = mainArr => {
    mainArr.map(item => {
      if (item.childItems.nodes.length > 1) {
        fixedMenu.push(item)
        fix(item.childItems.nodes)
      } else {
        fixedMenu.push(item)
      }
    })
  }
  fix(menuData)
  return fixedMenu
}

export default FlattenMenu

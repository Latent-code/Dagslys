let hiddenItems = [251, 45, 46, 47]

function restructureFoldersAndItems (folders, items) {
  let completeMenuArr = []
  let testArr = []

  const test = items.map(item => {
    if (item.in_shop === true) {
      item.parentFolderId = parseInt(item.folder.split("/").slice(-1))
      completeMenuArr.push(item)
    }
  })
  console.log(completeMenuArr === test)

  folders.map((item, index) => {
    if (
      item.itemtype === "contact" ||
      item.itemtype === "vehicle" ||
      item.itemtype === "user"
    ) {
      folders.splice(index, 1)
    } else if (
      item.displayname.startsWith("import-") ||
      item.displayname.startsWith("Import-")
    ) {
      // Hidden items defined at top level
    } else if (hiddenItems.includes(item.id)) {
      folders.splice(index, 1)
    } else {
      if (item.parent != null) {
        item.parentFolderId = parseInt(item.parent?.split("/").slice(-1))
        completeMenuArr.push(item)
      } else if (item.id === 320) {
        item.parentFolderId = null
        completeMenuArr.push(item)

        testArr.push(item)
      } else {
        item.parentFolderId = null
        completeMenuArr.push(item)
      }
    }
  })

  const menuSort = (function (data, root) {
      var t = {}
      data.forEach(o => {
        Object.assign((t[o.id] = t[o.id] || {}), o)
        ;((t[o.parentFolderId] ??= {}).children ??= []).push(t[o.id])
      })
      return t[root].children
    })(completeMenuArr, null),
    shop = (r, { children = [], ...o }) => {
      children = children.reduce(shop, [])
      const sub = children.length ? { children } : {}
      if (o.in_shop || sub.children) r.push({ ...o, ...sub })
      return r
    }
  let finalMenu = menuSort.reduce(shop, [])

  function setPath(o) {
    o.urlPath = this.concat(
      "/",
      o.name.replaceAll(" ", "-").replaceAll("|", "").toLowerCase(),
    )
    Array.isArray(o.children) && o.children.forEach(setPath, o.urlPath)
  }

  finalMenu.map(i => setPath.bind("")(i))
  // completeMenuArr.map(i => console.log("REIEL", i))

  const flatten = members => {
    let children = []
    const flattenMembers = members.map(m => {
      if (m.children && m.children.length) {
        children = [...children, ...m.children]
      }
      return m
    })

    return flattenMembers.concat(children.length ? flatten(children) : children)
  }
  const editFolders = []
  const editItems = []

  const tempData = flatten(finalMenu)
  tempData.forEach((item, index) => {
    // console.log("sortering flat: ", item)
    if (item.path) {
      editFolders.push(item)
    } else {
      editItems.push(item)
    }
  })

  return {
    editFolders,
    editItems,
  }
}
module.exports = { restructureFoldersAndItems };


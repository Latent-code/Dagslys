let hiddenItems = [251, 45, 46, 47]

const slugify = (name) => {
  return name
    .toString()
    .normalize("NFD") // Normalize to handle special Unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove all non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .toLowerCase(); // Convert to lowercase
};

function restructureFoldersAndItems(folders, items) {
  let completeMenuArr = []
  let testArr = []

  const test = items.map(item => {
    if (item.in_shop === true) {
      item.parentFolderId = parseInt(item.folder.split("/").slice(-1))
      completeMenuArr.push(item)
    }
  })
  // console.log(completeMenuArr === test)

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

  

  function setPath(o, basePath = '') {
    // Determine the name based on custom fields or default to the regular name
    const nameVar = o.name;

    // Sanitize the name to create a URL-friendly version
    const sanitizedPart = slugify(o.name)

    // nameVar
    //     .replaceAll(" ", "-")
    //     .replaceAll("|", "")
    //     .replaceAll("/", "-")  // Replace slashes to avoid directory misinterpretation
    //     .toLowerCase();

    // Concatenate the base path with the sanitized part to form the full URL path
    o.urlPath = `${basePath}/${sanitizedPart}`.replace(/\/\//g, '/'); // Remove any double slashes

    // console.log("Current URL Path:", o.urlPath);  // Debugging output

    // Recursively apply this function to all children, passing the current item's URL as the new base path
    if (Array.isArray(o.children) && o.children.length > 0) {
        o.children.forEach(child => setPath(child, o.urlPath));
    }
}

// Assuming `finalMenu` is the root level array from where the paths should start
finalMenu.forEach(item => setPath(item));
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
module.exports = { restructureFoldersAndItems }

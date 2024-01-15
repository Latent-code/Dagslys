import React, { useEffect, useState } from "react";
import { Breadcrumbs, Item } from "@adobe/react-spectrum";
import { navigate } from "gatsby";

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatName = (str) => {
  return capitalizeFirstLetter(str.replace(/-/g, " "));
};

const Breadcrumb = ({ url }) => {
  const [folderUrl, setFolderUrl] = useState(null);
  const reg = new RegExp(/\/(?!\/)/);
  const urlArr = url.split(reg).slice(1);

  let temp = "";
  const breadcrumbItems = urlArr.map((item, index) => {
    const parts = item.split("/");
    const result = parts[parts.length - 1];
    temp = temp + "/" + item;
    return {
      link: temp,
      name: decodeURIComponent(index === urlArr.length - 1 ? result : formatName(parts.slice(-1)[0])),
    };
  });

  // Remove the last item if it has an empty name and a trailing slash
  if (breadcrumbItems.length > 1 && breadcrumbItems.slice(-1)[0].name === "" && url.endsWith("/")) {
    breadcrumbItems.pop();
  }

  useEffect(() => {
    console.log(folderUrl);
    // navigate(folderUrl);
  }, [folderUrl]);

  return (
    <div style={{ marginTop: "1em" }}>
      <Breadcrumbs onAction={setFolderUrl} size="S">
        <Item key="/">Home</Item>
        {breadcrumbItems.map((item) => (
          <Item key={item.link}>{item.name}</Item>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default Breadcrumb;

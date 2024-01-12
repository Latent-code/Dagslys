import React, { useState, useEffect } from "react";
import { navigate, useLocation } from "@reach/router";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { Link } from "gatsby";

const MenuItem = ({ item }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const encodedPath = encodeURIComponent(item.urlPath);

  const expand = () => {
    setIsVisible(!isVisible);
  };

  const handleParentClick = (e, item) => {
    console.log("Item URL Path:", item.urlPath);
    console.log("Location Path:", decodeURI(location.pathname));
  
    if (item.urlPath + "/" === decodeURI(location.pathname)) {
      expand();
    } else {
      navigate(item.urlPath);
    }
  };
  

  const checkItemForPageChild = (item, currentPath) => {
    if (item.urlPath + "/" === currentPath) {
      setIsVisible(true);
    } else if (item.children?.length > 0) {
      item.children.forEach((i) => {
        checkItemForPageChild(i, currentPath);
      });
    }
  };

  useEffect(() => {
    checkItemForPageChild(item, decodeURI(location.pathname));
  }, [location.pathname, item]);

  return (
    <>
      {Object.prototype.hasOwnProperty.call(item, "children") ? (
        <>
        <Link to={item.urlPath}>

          <ListItemButton
            sx={{
              alignItems: "flex-end",
              borderBottom: "1px solid #dbdbdb",
            }}
            onClick={(e) => {
              handleParentClick(e, item);
            }}
          >
            <ListItemText
              sx={{ marginTop: "0px", marginBottom: "0px" }}
              primary={item.displayname}
            ></ListItemText>
            {isVisible ? (
              <ExpandLess
                sx={{ width: "0.9em !important", height: "0.9em" }}
                className="expand-icon"
              />
            ) : (
              <ExpandMore
                sx={{ width: "0.9em !important", height: "0.9em" }}
                className="expand-icon"
              />
            )}
          </ListItemButton>
          </Link>
          {item.children?.length > 0 ? (
            <Collapse
              sx={{ paddingLeft: "0.5rem" }}
              in={isVisible}
              timeout="auto"
              unmountOnExit
            >
              {isVisible &&
                item.children.map((child) => (
                  <div
                    key={child.displayname + child.id + "next"}
                    style={{ paddingLeft: 10 }}
                  >
                    <MenuItem item={child} />
                  </div>
                ))}
            </Collapse>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Link to={item.urlPath}>
        <ListItemButton
          sx={{
            alignItems: "flex-end",
            borderBottom: "1px solid #dbdbdb",
          }}
          onClick={(e) => {
            handleParentClick(e, item);
          }}
        >
          <ListItemText
            sx={{ marginTop: "0px", marginBottom: "0px" }}
            primary={item.displayname}
          ></ListItemText>
        </ListItemButton>
        </Link>
      )}
    </>
  );
};

export default MenuItem;

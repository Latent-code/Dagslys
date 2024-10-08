import React, { useContext, useEffect, useState, useMemo } from "react";
import { graphql, useStaticQuery, navigate } from "gatsby";
import { Link } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import ResponsiveDrawer from "../components/drawer/drawer";
import { Button, Typography } from "@mui/material";
import Line from "../components/line/line";
import { GatsbyImage, StaticImage } from "gatsby-plugin-image";
import { CartContext } from "../context/cartContext";
import PaginatedItemsWithProps from "../components/paginatedItemsWithProps/paginatedItemsWithProps";
import Pagination from "@mui/material/Pagination";
import ItemCounter from "../components/itemCounter/itemCounter";

// import { firebase } from "../utils/firebase"
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth"

// import { getAuth } from "firebase/auth";

// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import Breadcrumb from "../components/breadcrumb/breadcrumb";
import Loading from "../components/loading/loading";
import RentalPageItem from "../components/rentalPage/rentalPageItem";

// import { AppContext } from "../context/appContext"

const CamerasPage = ({ location }) => {
  const { cart, addItemToCart, addToCart } = useContext(CartContext);

  // console.log(cart)

  // const {user, handleUserChange, handleSignOut, handleSignIn} = useContext(AppContext)
  // const auth = getAuth(firebase)

  // console.log(useContext(AppContext))

  const data = useStaticQuery(graphql`
    query {
      allBrentRentalItem {
        nodes {
          displayname
          id
          image
          name
          rentmanId
          shop_description_long
          shop_description_short
          title
          in_shop
          folder
          pageLinkBrent
          code
          urlPath
          shop_featured
          price
          childFile {
            childImageSharp {
              gatsbyImageData(
                quality: 100
                placeholder: DOMINANT_COLOR
                layout: FULL_WIDTH
              )
            }
          }
        }
      }
      allBrentRentalFolder {
        nodes {
          displayname
          id
          name
          rentmanId
          title
          urlPath
          path
          itemtype
          pageLinkBrent
          menuParentBrent
          order
        }
      }

      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const menuPostContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0 6em",
    flexDirection: "column",
    alignItems: "flex-start",
  };
  const imageStyle = {
    margin: "1rem 1rem 1rem 1rem",
    display: "flex",
    height: "120px",
    width: "auto",
  };
  const textStyle = {
    margin: "1rem 1rem 1rem 1rem",
    fontWeight: 300,
    fontSize: "0.8em",
    display: "flex",
    width: "auto",
    height: "50px",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const headerButtonStyle = {
    marginTop: "3em",
    marginBottom: "1em",
    color: "#FFD115",
  };

  const cssGridChild = {
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    backgroundColor: "white",
    /* border-radius: 1rem 1rem 1rem 1rem; */
    border: "1px solid rgba(0, 0, 0, 0.383)",
    width: "200px",
    height: "200px",
    cursor: "pointer",

    // display: "flex",
    // flexDirection: "column",
    // height: "251px",
    // gridTemplateColumns: "repeat(8, minmax(10px, 1fr))",
    // boxDhadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    // backgroundColor: "white",
    // /* border-radius: 1rem 1rem 1rem 1rem; */
    // border: "1px solid rgba(0, 0, 0, 0.383)",
  };

  // LOADING IF NOT REASDY
  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState();
  const [children, setChildren] = useState([]);

  const hiddenItems = [251, 45, 46, 47];
  const FolderData = data.allBrentRentalFolder.nodes;
  const RentalData = data.allBrentRentalItem.nodes;

  const test = RentalData.filter((item) => item.in_shop === true);

  const menuParentChildrenArr = [[], [], [], [], [], [], [], [], [], []];

  useEffect(() => {
    fixMenu();
    // signInWithEmailAndPassword(auth, "reiel@reiel.no", "reielreiel")
    // .then(userCredential => {
    //   setUser(userCredential.user);
    //   // console.log(userCredential)
    //   // return(userCredential)
    // })
    // .catch(error => {
    //   const errorCode = error.code
    //   const errorMessage = error.message

    //   let message = error.message.replace("Firebase:", "")

    //   // toast({
    //   //   message: `${message}`,
    //   //   color: 'danger'
    //   // });
    //   console.log(errorMessage, errorCode)
    // })
    // signInWithEmailAndPassword("reiel@reiel.no", "reielreiel")
  }, []);

  const fixMenu = () => {
    let completeMenuArr = [];
    // Change folder and parent to a number, not string
    RentalData.map((item, index) => {
      if (!item.in_shop) {
        RentalData.splice(index, 1);
      } else if (
        item.path?.startsWith("import") ||
        item.path?.startsWith("Import")
      ) {
        RentalData.splice(index, 1);
      }
      item.parentFolderId = parseInt(item.folder.split("/").slice(-1));
      completeMenuArr.push(item);
    });
    FolderData.map((item, index) => {
      if (
        item.itemtype === "contact" ||
        item.itemtype === "vehicle" ||
        item.itemtype === "user"
      ) {
        FolderData.splice(index, 1);
      } else if (
        item.displayname.startsWith("import-") ||
        item.displayname.startsWith("Import-")
      ) {
      } else if (hiddenItems.includes(item.rentmanId)) {
        FolderData.splice(index, 1);
      } else {
        if (item.menuParentBrent != null) {
          item.parentFolderId = parseInt(
            item.menuParentBrent?.split("/").slice(-1)
          );
          completeMenuArr.push(item);
        } else {
          item.parentFolderId = null;
          completeMenuArr.push(item);
        }
      }
    });

    const menuSort = (function (data, root) {
        var t = {};
        data.forEach((o) => {
          Object.assign((t[o.rentmanId] = t[o.rentmanId] || {}), o);
          ((t[o.parentFolderId] ??= {}).children ??= []).push(t[o.rentmanId]);
        });
        return t[root].children;
      })(completeMenuArr, null),
      shop = (r, { children = [], ...o }) => {
        children = children.reduce(shop, []);
        const sub = children.length ? { children } : {};
        if (o.in_shop || sub.children) r.push({ ...o, ...sub });
        return r;
      };
    let finalMenu = menuSort.reduce(shop, []);
    setMenu(sort(finalMenu)); // Layout menu setter
    setIsLoading(false);

    recursiveFixMenu(finalMenu);
  };

  const recursiveFixMenu = (rentmanData) => {
    const recursive = (data, arr) => {
      data.map((item) => {
        if (item.children) {
          recursive(item.children, arr);
        } else {
          arr.push(item);
        }
      });
    };
    rentmanData.map((i, index) => {
      recursive(i.children, menuParentChildrenArr[index]);
    });
    setChildren(menuParentChildrenArr);
  };

  const sort = (arr) => {
    // SORT THE MENU BASED ON ORDER IN RENTMAN
    return arr.sort((a, b) => a.order - b.order);
  };

  const Paginate = ({ array, item, pageSize }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleChange = (event, value) => {
      setCurrentPage(value);
    };

    const currentViewData = useMemo(() => {
      const firstPageIndex = (currentPage - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;
      return array.slice(firstPageIndex, lastPageIndex);
    }, [currentPage]);

    return (
      <Pagination
        sx={{
          margin: "1em 0",
          color: "black",
          button: { color: "primary" },
        }}
        count={Math.ceil(array.length / pageSize)}
        page={currentPage}
        onChange={handleChange}
        color="secondary"
        variant="outlined"
      />
    );
  };

  // item={item}
  // index={index}
  // array={children[index]}
  // const PageRentalItems = ({ item, array }) => {
  //   const pageSize = 10;

  //   const [currentPage, setCurrentPage] = useState(1);

  //   const handleChange = (event, value) => {
  //     setCurrentPage(value);
  //   };

  //   const currentViewData = useMemo(() => {
  //     const firstPageIndex = (currentPage - 1) * pageSize;
  //     const lastPageIndex = firstPageIndex + pageSize;
  //     return array.slice(firstPageIndex, lastPageIndex);
  //   }, [currentPage]);

  //   // console.log(children[index])
  //   return !(array.length <= pageSize) ? (
  //     <>
  //       <Button
  //         onClick={(e) => navigate("/rental" + item.urlPath)}
  //         style={headerButtonStyle}
  //         variant="text"
  //       >
  //         {item.displayname}
  //       </Button>
  //         <Pagination
  //           sx={{
  //             margin: "1em 0",
  //             color: "black",
  //             button: { color: "primary" },
  //           }}
  //           count={Math.ceil(array.length / pageSize)}
  //           page={currentPage}
  //           onChange={handleChange}
  //           color="secondary"
  //           variant="outlined"
  //         />
  //       <div className="page-flex">
  //         {currentViewData.map((rentalItem) => {
  //           // console.log(children[index])
  //           return (
  //             <RentalPageItem
  //               key={rentalItem.id}
  //               menuChildren={rentalItem}
  //               variant="standard"
  //             />
  //           );
  //         })}
  //       </div>
  //     </>
  //   ) : (
  //     <>
  //       <Button
  //         onClick={(e) => navigate("/rental" + item.urlPath)}
  //         style={headerButtonStyle}
  //         variant="text"
  //       >
  //         {item.displayname}
  //       </Button>
  //       <div className="page-flex">
  //         {currentViewData.map((rentalItem) => {
  //           // console.log(children[index])
  //           return (
  //             <RentalPageItem
  //               key={rentalItem.id}
  //               menuChildren={rentalItem}
  //               variant="standard"
  //             />
  //           );
  //         })}
  //       </div>
  //     </>
  //   );
  
  console.log(decodeURIComponent("https://s3-eu-west-1.amazonaws.com/rentman-production/64881%2Frm4_brent_1580_google_image_f175ccbb00feff3a0f893627b1300873.jpeg%2Fjpg%2Fjpe%2Fjfif"))
  return (
    <>
      <SEO
        title="Dagslys rental portal home"
        description="Dagslys rental portal, a tool for lighting designers to book their own equipment"
      />
      {!isLoading ? (
        <>
          <div>
            <Breadcrumb url={location.pathname} name={"Home"}></Breadcrumb>
            <Typography variant="h2">All equipment</Typography>
            <Line position={"flex-start"}></Line>
            <div style={menuPostContainer}>
              {menu.map((item, index) => {
                // HVIS VI ØNSKER UTEN KNAPP PÅ DENNE:
                // if (item.rentmanId === 320) {
                //   return (
                //     <div key={item.id}>
                //       <div onClick={() => addToCart(item)}>Packages</div>
                //       <div className="page-flex">
                //         {children[index].map(rentalItem => {
                //           return (
                //             <RentalPageItem
                //               key={rentalItem.id}
                //               menuChildren={rentalItem}
                //             />
                //           )
                //         })}
                //       </div>
                //     </div>
                //   )
                // } else {
                return (
                  <PaginatedItemsWithProps
                    array={children[index]}
                    renderItems={(array, pageSize, currentPage, handleChange, currentViewData) => {
                      return !(array.length <= pageSize) ? (
                        <>
                          <Button
                            onClick={(e) => navigate(item.urlPath)}
                            style={headerButtonStyle}
                            variant="text"
                          >
                            {item.displayname}
                          </Button>
                          <Pagination
                            sx={{
                              margin: "1em 0",
                              color: "black",
                              button: { color: "primary" },
                            }}
                            count={Math.ceil(array.length / pageSize)}
                            page={currentPage}
                            onChange={handleChange}
                            color="secondary"
                            variant="outlined"
                          />
                          <div className="page-flex">
                            {currentViewData.map((rentalItem) => {
                              // console.log(children[index])
                              return (
                                <RentalPageItem
                                  key={rentalItem.id}
                                  menuChildren={rentalItem}
                                  variant="standard"
                                />
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={(e) => navigate(item.urlPath)}
                            style={headerButtonStyle}
                            variant="text"
                          >
                            {item.displayname}
                          </Button>
                          <div className="page-flex">
                            {currentViewData.map((rentalItem) => {
                              // console.log(children[index])
                              return (
                                <RentalPageItem
                                  key={rentalItem.id}
                                  menuChildren={rentalItem}
                                  variant="standard"
                                />
                              );
                            })}
                          </div>
                        </>
                      );
                    }}
                  ></PaginatedItemsWithProps>
                  // <div key={item.id}>
                  //   <Button
                  //     onClick={(e) => navigate(item.urlPath)}
                  //     sx={headerButtonStyle}
                  //     variant="outlined"
                  //     color="secondary"
                  //   >
                  //     {item.displayname}
                  //   </Button>
                  //   {/* <Paginate
                  //       arrayLength={children}
                  //       item={item}
                  //       pageSize={15}
                  //       array
                  //       index={index}
                  //     >

                  //     </Paginate> */}
                  //   <div className="page-flex">
                  //     {children[index].map((rentalItem) => {
                  //       return (
                  //         <RentalPageItem
                  //           key={rentalItem.id}
                  //           menuChildren={rentalItem}
                  //         />
                  //       );
                  //     })}
                  //   </div>
                  // </div>
                );
                // }
              })}
            </div>
          </div>
        </>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
};

export default CamerasPage;
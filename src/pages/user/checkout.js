import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { CartContext } from "../../context/cartContext";
import {
  Button,
  DateRangePicker,
  TextField,
  TableView,
  Flex,
  Text,
  Form,
  Dialog,
  Column,
  Link,
  MenuTrigger,
  Divider,
  Item,
  TableBody,
  TableHeader,
  Row,
  Cell,
  Menu,
  ActionButton,
  useDialogContainer,
  Heading,
  Content,
  DialogContainer,
  ButtonGroup,
} from "@adobe/react-spectrum";

import { Typography } from "@mui/material";

import { parseAbsoluteToLocal } from "@internationalized/date";
import MoreSmallListVert from "@spectrum-icons/workflow/MoreSmallListVert";

import PrivateRoute from "../../components/privateRoute/privateRoute";
import { useDateFormatter } from "@adobe/react-spectrum";
import { navigate } from "gatsby";
import { addOrder } from "../../utils/firestoreCRUD";
import { AppContext } from "../../context/appContext";
import ItemCounter from "../../components/itemCounter/itemCounter";
import Loading from "../../components/loading/loading";

import "./user.css";

const Checkout = () => {
  const {
    cart,
    setCart,
    getCartTotal,
    getUserDiscountedPrice,
    addToCart,
    removeFromCart,
    removeItemFromCart,
  } = useContext(CartContext);

  const { user, userData, setIsPopupOpen, handleClosePopup } =
    useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState();
  const [remark, setRemark] = useState("");
  const [projectRemark, setProjectRemark] = useState("");
  const [date, setDate] = useState({
    start: parseAbsoluteToLocal(new Date().toISOString()),
    end: parseAbsoluteToLocal(new Date(Date.now() + 6.048e8 * 2).toISOString()),
  });
  const daysOfRent = Math.round(
    Math.abs((date.start.toDate() - date.end.toDate()) / (24 * 60 * 60 * 1000))
  );

  const [editItem, setEditItem] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [allProjectEquipment, setAllProjectEquipment] = useState([]);
  const [availableData, setAvailableData] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const projectData = JSON.stringify({
    // linked_contact: "/contacts/0",
    // contact_mailing_number: "string",
    // contact_mailing_country: "string",
    // contact_mailing_postalcode: "string",
    // contact_mailing_city: "string",
    // contact_mailing_street: "string",
    // contact_person_middle_name: "string",
    // language: "string",
    // location_mailing_number: "string",
    // location_mailing_country: "string",
    // location_name: "string",
    // location_mailing_postalcode: "string",
    // location_mailing_city: "string",
    // location_mailing_street: "string",
    contact_name: userData?.firstName + " " + userData?.lastName,
    contact_person_lastname: userData?.lastName,
    contact_person_email: userData?.email,
    contact_person_first_name: userData?.firstName,
    usageperiod_end: date.end.toDate().toISOString(),
    usageperiod_start: date.start.toDate().toISOString(),
    in: new Date(
      date.end.toDate().setDate(date.end.toDate().getDate() + 1)
    ).toISOString(),
    out: new Date(
      date.start.toDate().setDate(date.start.toDate().getDate() - 1)
    ).toISOString(),
    name: projectName,
    external_reference: 0,
    remark: projectRemark,
    planperiod_end: new Date(
      date.end.toDate().setDate(date.end.toDate().getDate() + 1)
    ).toISOString(),
    planperiod_start: new Date(
      date.start.toDate().setDate(date.start.toDate().getDate() - 1)
    ).toISOString(),
    price: getCartTotal(),
  });

  // Gammel funksjon, Await.all gir en bedre opplevelse, hvis noe feiler. Da slipper vi at halve carten kommer til rentman, og resten bare blir borte.
  async function deleteProjectRequest(id) {
    const url =
      "https://corsproxy.io/?" +
      encodeURIComponent(`https://api.rentman.net/projectrequests/${id}`);
    const token = process.env.GATSBY_RENTMAN_API;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // Bare for å gi brukeren en følelse av at noe loader....
        // setTimeout(() => {
        //   setIsLoading(false)
        // }, 2000)
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }
  // async function addItemToProject(id, content) {
  //   const url =
  //     "https://corsproxy.io/?" +
  //     encodeURIComponent(
  //       `https://api.rentman.net/projectrequests/${id}/projectrequestequipment`,
  //     )
  //   const token = process.env.GATSBY_RENTMAN_API

  //   var myHeaders = new Headers()
  //   myHeaders.append("Content-Type", "application/json")
  //   myHeaders.append("Authorization", `Bearer ${token}`)

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: content,
  //     redirect: "follow",
  //   }

  //   fetch(url, requestOptions)
  //     .then(response => response.json())
  //     .then(result => {
  //       // Bare for å gi brukeren en følelse av at noe loader....
  //       setTimeout(() => {
  //         // setIsLoading(false)
  //       }, 2000)
  //       console.log(result)
  //     })
  //     .catch(error => {
  //       console.log("error", error)
  //       setIsPopupOpen({
  //         open: true,
  //         message:
  //         `Error fetching data for item: ${item.name}`,
  //         severity: "error",
  //         closePopup: handleClosePopup,
  //       })
  //     })
  // }

  async function addItemsToProject(id, fnCart) {
    const url =
      "https://corsproxy.io/?" +
      encodeURIComponent(
        `https://api.rentman.net/projectrequests/${id}/projectrequestequipment`
      );
    const token = process.env.GATSBY_RENTMAN_API;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const allItemResponse = await Promise.all(
      fnCart.map(async (item) => {
        // console.log("ITEM ORCERED: ",item)
        let cartItemData = JSON.stringify({
          // quantity: item.quantity,
          quantity_total: item.quantity,
          // is_comment: true,
          // is_kit: true,
          discount: user.discount,
          linked_equipment: `/equipment/${item.rentmanId}`,
          name: item.name,
          external_remark: item.itemRemark ?? "",
          // parent: "/projectrequestequipment/0",
          unit_price: 0,
          factor: "factor",
          order: "order",
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: cartItemData,
          redirect: "follow",
        };

        return fetch(url, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setIsPopupOpen({
              open: true,
              message: "Request sendt for project " + projectName,
              severity: "success",
              closePopup: handleClosePopup,
            });
            return result;
          })
          .catch((error) => {
            setIsPopupOpen({
              open: true,
              message:
                "Request failed, project" +
                projectName +
                "was deleted, try again or contact support...",
              severity: "error",
              closePopup: handleClosePopup,
            });
            deleteProjectRequest(id);
          });
      })
    ).then(result => {
      addOrder({
        collection: "dagslys",
        userEmail: user.email,
        id: id,
        contact_name: userData.firstName + " " + userData.lastName,
        contact_person_first_name: userData.firstName,
        contact_person_lastname: userData.lastName,
        contact_person_email: user.email,
        usageperiod_start: date.start.toDate().toISOString(),
        usageperiod_end: date.end.toDate().toISOString(),
        checkIn: new Date(
          date.end.toDate().setDate(date.end.toDate().getDate() + 1)
        ).toISOString(),
        checkOut: new Date(
          date.start.toDate().setDate(date.start.toDate().getDate() - 1)
        ).toISOString(),
        projectName: projectName,
        external_reference: 0,
        remark: projectRemark === undefined ? projectRemark : "",
        planperiod_start: new Date(
          date.start.toDate().setDate(date.start.toDate().getDate() - 1)
        ).toISOString(),
        planperiod_end: new Date(
          date.end.toDate().setDate(date.end.toDate().getDate() + 1)
        ).toISOString(),
        price: getCartTotal().toFixed(2),
        cart: cart,
      });
    });
    return allItemResponse;
  }

  async function createProjectRequest() {
    setIsLoading(true);

    const url =
      "https://corsproxy.io/?" +
      encodeURIComponent("https://api.rentman.net/projectrequests/");
    const token = process.env.GATSBY_RENTMAN_API;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: projectData,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        addItemsToProject(result.data.id, cart);
        setIsLoading(false);
      })
      .then()
      .catch((error) => {
        console.log("error", error);
        setIsPopupOpen({
          open: true,
          message:
            "Request failed, project" +
            projectName +
            "was deleted, try again or contact support...",
          severity: "error",
          closePopup: handleClosePopup,
        });
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true, createProjectRequest());
  };
  const handleEditItemRemark = (e, item) => {
    if (e === "edit") {
      console.log(e, item);
      // setIsEdit(true)
    } else if (e === "delete") {
      console.log(e, item);
      removeItemFromCart(item);
    }
    // removeFromCart(item)
    // setIsLoading(true, createProjectRequest())
  };
  const addItem = (item) => {
    addToCart(item);
  };
  const removeItem = (item) => {
    removeFromCart(item);
  };

  const handleDialog = (dialog, item) => {
    if (dialog === "edit") {
      setDialog("edit");
      setEditItem(item);
      setRemark(item.itemRemark);
    } else if (dialog === "delete") {
      setDialog("delete");
      setEditItem(item);
    }
  };

  function EditDialog() {
    // This hook allows us to dismiss the dialog when the user
    // presses one of the buttons (below).
    let dialog = useDialogContainer();
    return (
      <Dialog>
        <Heading>Edit</Heading>
        <Divider />
        <Content labelPosition="side" width="100%">
          <TextField
            autoFocus
            label="Remark"
            value={remark}
            onChange={setRemark}
          />
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={dialog.dismiss}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onPress={(e) => {
              setCart(
                (oldState) =>
                  oldState.map((i) => {
                    if (i.id === editItem.id) {
                      // console.log(i, )
                      // console.log(item)
                      // console.log(cart)
                      return {
                        ...i,
                        itemRemark: "",
                      };
                    }
                    return { ...i };
                  }),
                setDialog(null),
                setRemark("")
              );
            }}
          >
            Clear remark
          </Button>
          <Button
            variant="accent"
            onPress={() =>
              setCart(
                (oldState) =>
                  oldState.map((i) => {
                    if (i.id === editItem.id) {
                      // console.log(i, )
                      // console.log(item)
                      // console.log(cart)
                      return {
                        ...i,
                        itemRemark: remark,
                      };
                    }
                    return { ...i };
                  }),
                setDialog(null),
                setRemark("")
              )
            }
          >
            Save
          </Button>
        </ButtonGroup>
      </Dialog>
    );
  }
  function DeleteDialog() {
    // This hook allows us to dismiss the dialog when the user
    // presses one of the buttons (below).
    let dialog = useDialogContainer();
    return (
      <Dialog>
        <Heading>Delete item</Heading>
        <Divider />
        <Content>
          <Text>
            Are you sure you want to remove all {editItem.quantity}{" "}
            {editItem.name} from the cart?
          </Text>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={dialog.dismiss}>
            Cancel
          </Button>
          <Button
            variant="accent"
            onPress={() => {
              setCart(cart.filter((cartItem) => cartItem.id !== editItem.id));
              setDialog(null);
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
      </Dialog>
    );
  }

  const getData = async (endpoint, limit, offset) => {
    const completeURL = `${process.env.GATSBY_API_URL}endpoint=${endpoint}&limit=${limit}&offset=${offset}`;

    try {
      const response = await fetch(completeURL, {
        // Add any additional options here (headers, method, etc.)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getData:", error.message);
      console.error("Error:", error);

      throw error;
    }
  };

  const fetchData = async () => {
    try {
      // Call the APIs to fetch data
      const allData = await fetchDataForAllItems();
      setAvailableData(allData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsPopupOpen({
        open: true,
        message: error,
        severity: "error",
        closePopup: handleClosePopup,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getAllProjectEquipment = async () => {
      setIsLoading(true);
      try {
        fetchData();
      } catch (error) {
        console.error("Error fetching project equipment:", error);
        setIsPopupOpen({
          open: true,
          message: "Error fetching project equipment: ",
          error,
          severity: "error",
          closePopup: handleClosePopup,
        });
      } finally {
      }
    };
    // Call the function to fetch all project equipment data
    getAllProjectEquipment();
  }, []); // Empty dependency array ensures it runs only on mount

  const get = async () => {
    setIsTableLoading(true);

    const data = await fetchDataForAllItems();
    setAvailableData(data);
    setIsTableLoading(false);
  };

  useEffect(() => {
    get();
  }, [cart.length, date]);

  const getProjectEquipmentItemsIds = () => {
    let projectEquipmentItemsId = cart
      .map((item) =>
        allProjectEquipment.filter(
          (i) => JSON.parse(i.equipment.split("/").slice(-1)) === item.rentmanId
        )
      )
      .flat(1);
    // console.log("projectEquipmentItemsId", projectEquipmentItemsId)
    return projectEquipmentItemsId;
  };

  // Fetch item quantity
  const fetchItemCurrentQuantity = async (rentmanId) => {
    const itemEndpoint = `https://api.rentman.net/equipment/${rentmanId}`;

    const itemData = await getData(itemEndpoint, 10, 10);
    if (itemData && itemData.body && itemData.body.data) {
      return await itemData.body.data.current_quantity;
    } else {
      console.error(`Error fetching data for item with ID ${rentmanId}`);
      return null; // or handle the error as needed
    }
  };

  

  const fetchDataFromEquipmentId = async (item) => {
    // console.log(item)
    if (!item) {
      // Handle null value (or missing item) here
      console.error("Null or missing item:", item);
      return null; // Or replace with default values
    }
    const endpoint = encodeURIComponent(
      `https://api.rentman.net/projectequipment?equipment=/equipment/${item.rentmanId}`
    );
    const limit = 0; // Replace with the actual limit if needed
    const offset = 0; // Replace with the actual offset if needed

    // console.log(encodeURIComponent(endpoint))
    const response = await getData(endpoint, limit, offset);

    // Ensure that the response has the expected structure
    if (response && response.body && response.body.data) {
      const equipmentData = response.body.data.map((dataItem) => ({
        ...dataItem,
        name: item.name,
      }));

      return equipmentData;
    } else {
      // console.error(`Error fetching data for item with ID ${item.rentmanId}`)
      return null; // or handle the error as needed
    }
  };

  // Function to check if a date range overlaps
  const dateRangesOverlap = (start, end) => {
    const range1Start = new Date(date.start.toDate().toISOString());
    const range1End = new Date(date.end.toDate().toISOString());
    const orderStart = new Date(start);
    const OrderEnd = new Date(end);

    if (orderStart < range1End && range1Start < OrderEnd) {
      // console.log("The date ranges overlap.")
      return true;
    } else {
      // console.log("The date ranges do not overlap.")
      return false;
    }
  };
  const combinedData = async (allData) => {
    let result = [];

    for (const itemsArray of allData) {
      for (const currentItem of itemsArray) {
        // console.log('Processing item:', currentItem);

        const overlapsWithDateRange = dateRangesOverlap(
          currentItem.planperiod_start,
          currentItem.planperiod_end
        );

        if (overlapsWithDateRange) {
          // console.log('overlapsWithDateRange item:', currentItem);

          const existingItem = result.find(
            (item) => item.equipment === currentItem.equipment
          );

          if (existingItem) {
            // console.log('Existing item:', currentItem);

            // Check for time overlap within the equipment group
            const overlaps = existingItem.data.some((dataItem) =>
              dateRangesOverlap(
                dataItem.planperiod_start,
                dataItem.planperiod_end
              )
            );

            if (overlaps) {
              existingItem.data.push(currentItem);
              // Accumulate warehouse reservations for the group
              existingItem.totalWarehouseReservations +=
                currentItem.warehouse_reservations;
            }
          } else {
            // Fetch currentQuantity and wait for it to resolve
            const currentQuantity = await fetchItemCurrentQuantity(
              JSON.parse(extractEquipmentNumber(currentItem.equipment))
            );

            // Add a new entry if no match is found
            result.push({
              rentmanId: JSON.parse(
                extractEquipmentNumber(currentItem.equipment)
              ),
              name: currentItem.name,
              equipment: currentItem.equipment,
              data: [currentItem],
              totalWarehouseReservations: currentItem.warehouse_reservations,
              currentQuantity: currentQuantity,
            });
          }
        }
      }
    }
    return result;
  };
  const fetchDataForAllItems = async () => {

    const fetchDataPromises = cart.map(fetchDataFromEquipmentId);
    const allData = await Promise.all(fetchDataPromises);

    // Execute the combinedData function and await its result
    const filteredData = await combinedData(allData);

    // Remove items with no overlap and unchanged currentQuantity
    const updatedFilteredData = filteredData.filter(
      ({ data, currentQuantity }) => {
        const isAnyOverlap = data.some((dataItem) =>
          dateRangesOverlap(dataItem.planperiod_start, dataItem.planperiod_end)
        );
        return isAnyOverlap || currentQuantity !== 0;
      }
    );

    return updatedFilteredData.map(
      ({
        data,
        equipment,
        totalWarehouseReservations,
        rentmanId,
        currentQuantity,
        name,
      }) => {
        const isAnyOverlap = data.some((dataItem) =>
          dateRangesOverlap(dataItem.planperiod_start, dataItem.planperiod_end)
        );

        // Create the final object with both data and defaultValues
        return {
          data: { ...data },
          name,
          equipment,
          isAnyOverlap,
          totalWarehouseReservations,
          currentQuantity,
          rentmanId,
        };
      }
    );
  };

  const extractEquipmentNumber = (equipmentProperty) => {
    // Assuming the "equipment" property is always in the format "/equipment/{number}"
    const matches = equipmentProperty.match(/\/equipment\/(\d+)/);
    return matches ? matches[1] : null;
  };

  // const isCartItemsAvailable = () => {
  //   if (availableData.length === 0) {
  //     // console.error("item not in availableData")
  //     return !cart.some(e => e.currentQuantity < e.quantity)
  //   } else {
  //     // console.error("item exist availableData")
  //     let tempCart = cart.filter(
  //       item => !availableData.map(i => i.rentmanId).includes(item.rentmanId),
  //     )
  //     const noOverlap = tempCart.some(x => x.currentQuantity < x.quantity)
  //     const overlap = availableData.some(e => {
  //       return cart.some(i => {
  //         if (i.rentmanId === e.rentmanId) {
  //           return e.currentQuantity - e.totalWarehouseReservations < i.quantity
  //         }
  //       })
  //     })
  //     return !(noOverlap || overlap)
  // }}

  // const checkRowIsAvailable = item => {
  //   if (!availableData.some(i => i.rentmanId === item.rentmanId)) {
  //     // console.log("i => i.rentmanId !== iten.rentmanId")
  //     return item.currentQuantity >= item.quantity
  //   } else {
  //     return availableData.some(
  //       e =>
  //         e.rentmanId === item.rentmanId &&
  //         e.currentQuantity - e.totalWarehouseReservations >= item.quantity,
  //     )
  //   }
  // }

  const addItemWithChild = (setQuantity, item) => {
    addToCart(item, setQuantity);
  };

  const flex = {
    position: "absolute",
    zIndex: "9",
    height: "100%",
    width: "100%",
    backgroundColor: "#00000021",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <PrivateRoute>
      <div>
        <div>
          <Typography variant="h2">Your cart</Typography>
          <Divider size="s"></Divider>
          {/* <ListView selectionMode="single" selectionStyle="highlight">
        
            {cart.map(item => {
              return (
                <Item>
                  <Flex>
                    <Text>{item.name}</Text>
                    <Text slot="description">
                      Quantity: {item.quantity} Price: {item.price}{" "}
                    </Text>
                  </Flex>
                </Item>
               
              )
            })}
          </ListView> */}
          <div style={{ position: "relative" }}>
            {isTableLoading && (
              <div style={flex}>
                <div>
                  <Loading size={"10%"} inline={true} />
                </div>
              </div>
            )}
            <TableView>
              <TableHeader>
                <Column width="12%">Amount</Column>
                {/* <Column width="12%">Available</Column> AVAILABLE AMOUNT */}
                <Column>Name</Column>
                <Column>Item remark</Column>
                <Column width="12%">Price</Column>
                <Column align="end" width="12%"></Column>
              </TableHeader>
              <TableBody>
                {cart.map((item) => {
                  return (
                    // <ItemRow item={item}></ItemRow>
                    <Row key={item.name}>
                      <Cell>
                        {/* {checkRowIsAvailable(item) ? ( */}
                        <div
                          style={{
                            padding: "0px 10px",
                            borderRadius: "3px",
                          }}
                        >
                          <ItemCounter
                            price={item.price}
                            addItem={addItemWithChild}
                            removeFromCart={() => removeItem(item)}
                            quantity={item.quantity}
                            full={false}
                            optionalItem={item}
                            // style={!REIEL.find((i) => i.rentmanId === item.rentmanId && i.units < item.quantity) ? "" : {backgroundColor: "red"} }
                          ></ItemCounter>
                        </div>
                        {/* ) : (
                          <div
                            style={{
                              backgroundColor: "#ff000047",
                              padding: "0px 10px",
                              borderRadius: "3px",
                            }}
                          >
                            <ItemCounter
                              price={item.price}
                              addItem={addItemWithChild}
                              removeFromCart={() => removeItem(item)}
                              quantity={item.quantity}
                              full={false}
                              optionalItem={item}

                              // style={!REIEL.find((i) => i.rentmanId === item.rentmanId && i.units < item.quantity) ? "" : {backgroundColor: "red"} }
                            ></ItemCounter>
                          </div>
                        )} */}
                      </Cell>
                      {/* <Cell>
                       Available amount here
                      </Cell> */}
                      <Cell>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Link onClick={(e) => navigate(item.urlPath)}>
                            {item.name}
                          </Link>

                          {/* <ActionButton
                          price={item.price}
                          addItem={addItem}
                          removeFromCart={removeItem}
                          quantity={item.quantity}
                          variant="secondary"
                          >
                          Delete
                        </ActionButton> */}
                        </Flex>
                      </Cell>
                      {item.itemRemark ? (
                        <Cell> {item.itemRemark}</Cell>
                      ) : (
                        <Cell>
                          {" "}
                          <div style={{ color: "#9e9e9e" }}>No remarks</div>
                        </Cell>
                      )}
                      <Cell>{(item.price * item.quantity).toFixed(2)}</Cell>
                      <Cell>
                        <MenuTrigger>
                          <ActionButton isQuiet>
                            <MoreSmallListVert />
                          </ActionButton>
                          <Menu
                            onAction={(e) => {
                              // console.log(e)
                              handleDialog(e, item);
                            }}
                          >
                            <Item key="edit">Item remark...</Item>
                            <Item key="delete">Remove item</Item>
                            {/* <Item>Paste</Item> */}
                          </Menu>
                        </MenuTrigger>
                        <DialogContainer onDismiss={() => setDialog(null)}>
                          {dialog === "edit" && <EditDialog item={item} />}
                          {dialog === "delete" && <DeleteDialog item={item} />}
                        </DialogContainer>
                      </Cell>
                    </Row>
                  );
                })}
              </TableBody>
            </TableView>
          </div>

          <div style={{ margin: "10px" }}> </div>
          <Flex alignItems="center" direction="row" gap="size-150">
            {/* <Button
              isPending={isLoading}
              isDisabled={cart.length === 0 ? true : false}
              variant="primary"
              onPress={checkItem}
            >
              Check availability
            </Button> 
             <Text isPending={isLoading} variant="primary">
              {isCartItemsAvailable() ? (
                <div>&nbsp;</div>
              ) : (
                <div style={{ color: "red" }}>
                  Some items are unavailable in your date range.
                </div>
              )}

              {/* <AvailabilityError /> 
            </Text> */}
          </Flex>
        </div>

        <div style={{ margin: "1.5rem" }}>
          Total Price : {(getCartTotal() * daysOfRent).toFixed(2)}{" "}
          {daysOfRent == 1 ? `NOK Pr day` : `NOK for ${daysOfRent} days`}
        </div>
        
        {userData?.discount !== 0 && (
          <div style={{ margin: "1.5rem" }}>
            After your {userData?.discount}% discount :{" "}
            {(getUserDiscountedPrice() * daysOfRent).toFixed(2)}{" "}
            {daysOfRent == 1 ? `NOK Pr day` : `NOK for ${daysOfRent} days`}
          </div>
        )}

        <Form
          maxWidth="size-4600"
          isRequired
          necessityIndicator="label"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Flex direction="row" gap="size-150">
            {/* <DatePicker
              label="Pickup date"
              value={start}
              onChange={setStart}
              isRequired={true}
            />
            <DatePicker label="Dropoff date" value={end} onChange={setEnd} /> */}
            <DateRangePicker
              label="Check-out / Check-in"
              granularity="day"
              isRequired={true}
              value={date}
              defaultValue={{
                start: parseAbsoluteToLocal("2023-12-07T07:45:00Z"),
                end: parseAbsoluteToLocal("2023-12-08T14:25:00Z"),
              }}
              onChange={setDate}
            />
          </Flex>
          <TextField
                    isDisabled

            label="Email"
            value={user?.email}
            isRequired={true}
          />
          <TextField
                    isDisabled

            label="First Name"
            value={userData?.firstName}
            // onChange={setFirstName}
            isRequired={true}
          />
          <TextField
          isDisabled
            label="Last Name"
            value={userData?.lastName}
            isRequired={true}
          />
          <TextField
            label="Project name"
            value={projectName}
            onChange={setProjectName}
            isRequired={true}
          />
          <TextField
            label="Other remarks"
            value={projectRemark}
            onChange={setProjectRemark}
            isRequired={false}
          />
          <br></br>
          <br></br>

          <Button
            isPending={isLoading}
            isDisabled={cart.length === 0}
            type="submit"
            variant="primary"
          >
            Confirm booking
          </Button>

          {cart.length === 0 ? <div>No items in cart...</div> : <></>}
        </Form>
      </div>
    </PrivateRoute>
  );
};

export default Checkout;

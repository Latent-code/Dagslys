import React, {
  Component,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { CartContext } from "../../context/cartContext";
import { AppContext } from "../../context/appContext";
import {
  Button,
  ActionButton,
  Content,
  DatePicker,
  Flex,
  Text,
  Form,
  Dialog,
  Column,
  Link,
  Header,
  Divider,
  ButtonGroup,
  TableView,
  TableBody,
  TableHeader,
  Row,
  Cell,
  useCollator,
  useAsyncList,
  NumberField,
} from "@adobe/react-spectrum";

import { Typography } from "@mui/material";
import { DraggableOrderTable } from "../../components/draggableTable/draggableTable";
import { parseDate } from "@internationalized/date";
import { useDateFormatter } from "@adobe/react-spectrum";
import { navigate } from "gatsby";
import PrivateRoute from "../../components/privateRoute/privateRoute";

const Home = () => {
  const { userData, isLoggedIn, setIsPopupOpen, handleClosePopup } =
    useContext(AppContext);
  const { cart, setCart } = useContext(CartContext);
  const [isPending, setIsPending] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectId, setProjectId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState();
  const [projectName, setProjectName] = useState();
  const [lastName, setLastName] = useState();
  const [firstName, setFirstName] = useState();
  const [start, setStart] = useState(parseDate("2021-01-01"));
  const [end, setEnd] = useState(parseDate("2021-01-01"));
  const [remark, setRemark] = useState();

  const handleOrderClick = (item) => {
    console.log(userData.orders);
    console.log(item.id);
    setCart(userData.orders.find((i) => i.id == selectedItem.currentKey).cart);
  };
  console.log(userData);

  const buildHooks = () => {
    setIsPending(true);
    axios
      .get(process.env.GATSBY_BUILD_HOOK)
      .then((response) => {
        console.log(response);
        setIsPopupOpen({
          open: true,
          message: "Website is building... should be ready in 5 to 10 minutes",
          severity: "success",
          closePopup: handleClosePopup,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setIsPending(false);
    }, "5000");
  };

  return (
    <PrivateRoute>
      <Typography variant="h1">{`Welcome back ${userData?.firstName} ${userData?.lastName}`}</Typography>
      <Typography variant="h2">Your past orders</Typography>
      {userData && <DraggableOrderTable></DraggableOrderTable>}
      {userData?.isAdmin && (
        <Content marginTop="size-1000">
          <Flex direction="column">
            <Text>
              Use build button with caution! Its made to rebuild the websiite only when relevant Rentman data has been updated
              or changed.
            </Text>
            <Button
              isPending={isPending}
              onPress={(e) => buildHooks()}
              marginTop="size-250"
              width="size-2400"
            >
              Rebuild website
            </Button>
          </Flex>
        </Content>
      )}
    </PrivateRoute>
  );
};

export default Home;

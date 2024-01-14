import React, {
  useContext,
  useState,
} from "react";

import axios from "axios";

import { AppContext } from "../../context/appContext";
import {
  Button,
  Content,
  Flex,
  Text,
} from "@adobe/react-spectrum";

import { Typography } from "@mui/material";
import { DraggableOrderTable } from "../../components/draggableTable/draggableTable";

import PrivateRoute from "../../components/privateRoute/privateRoute";

const Home = () => {
  const { userData, setIsPopupOpen, handleClosePopup } =
    useContext(AppContext);
  const [isPending, setIsPending] = useState(false);

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

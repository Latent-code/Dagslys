import React, { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/appContext";
import { Button, Content, Flex, Text } from "@adobe/react-spectrum";
import { Typography } from "@mui/material";
import { DraggableOrderTable } from "../../components/draggableTable/draggableTable";
import PrivateRoute from "../../components/privateRoute/privateRoute";

const Home = () => {
  const { userData, setIsPopupOpen, handleClosePopup } = useContext(AppContext);
  const [isPending, setIsPending] = useState(false);

  // const buildHooks = useCallback(() => {
  //   setIsPending(true);
  //   axios
  //     .get(process.env.GATSBY_BUILD_HOOK)
  //     .then((response) => {
  //       console.log(response);
  //       setIsPopupOpen({
  //         open: true,
  //         message: "Website is building... should be ready in 5 to 10 minutes",
  //         severity: "success",
  //         closePopup: handleClosePopup,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       setIsPending(false);
  //     });
  // }, [setIsPopupOpen, handleClosePopup]);

  // const handleButtonClick = () => {
  //   if (typeof window !== 'undefined') {
  //     buildHooks();
  //   }
  // };

  // useEffect(() => {
  //   // No need for cleanup if we use React's onClick directly
  // }, []);

  return (
    <PrivateRoute>
      <Typography variant="h1">{`Welcome back ${userData?.firstName} ${userData?.lastName}`}</Typography>
      <Typography variant="h2">Your past orders</Typography>
      {userData && <DraggableOrderTable />}
      {userData?.isAdmin && (
        <Content marginTop="size-1000">
          <Flex direction="column">
            <Text>
              Use the build button with caution! It's made to rebuild the website only when relevant Rentman data has been updated or changed.
            </Text>
            {/* <Button
              isPending={isPending}
              marginTop="size-250"
              width="size-2400"
              onClick={handleButtonClick}
            >
              Rebuild website
            </Button> */}
          </Flex>
        </Content>
      )}
    </PrivateRoute>
  );
};

export default Home;
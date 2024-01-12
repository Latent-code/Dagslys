import React, { useContext, forwardRef, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  ActionButton,
  TextField,
  Flex,
  Dialog,
  DialogTrigger,
  Heading,
  Divider,
  ButtonGroup,
  Content,
  Form,
} from "@adobe/react-spectrum";

import { AppContext } from "../../context/appContext";

export default function CustomizedModal() {
  const { isModalOpen, setIsModalOpen, addUser, databaseName, user } =
    useContext(AppContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handlleSubmit = () => {
    addUser({
      email: user?.email,
      brentCollection: databaseName,
      firstName: firstName,
      lastName: lastName,
    });
    setIsModalOpen(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault()
      handlleSubmit()
    }
  }

  return (
    <React.Fragment>
      <DialogTrigger isOpen={isModalOpen}>
        <div style={{ display: "none" }}>
          <ActionButton></ActionButton>
        </div>
        {(close) => (
          <Dialog>
            <Heading>Register your data</Heading>
            <Divider />
            <Content>
              <Form validationBehavior="native">
                <Flex gap="size-400" direction="column">
                  <Flex direction="row" gap="size-100">
                    <TextField
                      id="firstName"
                      label="First Name"
                      type="text"
                      value={firstName}
                      isRequired
                      name="password"
                      onChange={setFirstName}
                      // onKeyDown={(e) => test(e)}
                    />
                    <TextField
                      id="lastName"
                      label="Last Name"
                      type="text"
                      value={lastName}
                      isRequired
                      name="password"
                      onChange={setLastName}
                      // onKeyDown={(e) => test(e)}
                    />
                    <TextField
                      autoFocus
                      label="Email Address"
                      value={user?.email}
                      isRequired
                      name="email"
                      onKeyDown={e => handleKeyDown(e)}

                    />
                  </Flex>
                  <ButtonGroup align="end">
                    <Flex direction="row" gap="size-100">
                      <ActionButton
                        // type="submit"
                        onClick={(e) => {
                          handlleSubmit(e);
                          close();
                        }}
                      >
                        Register data...
                      </ActionButton>
                    </Flex>
                  </ButtonGroup>
                </Flex>
              </Form>
            </Content>
          </Dialog>
        )}
      </DialogTrigger>

    </React.Fragment>
  );
};
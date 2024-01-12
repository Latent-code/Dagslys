import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../../context/appContext"
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
} from "@adobe/react-spectrum"

export default function SignInPopup({ handleSignIn }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { isBrowser } = useContext(AppContext)

  const handleClickSignIn = (e) => {
    console.log("signin")
    handleSignIn(email, password)
    // setOpen(false)
  }

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleClickSignIn(email, password)
    }
  }

  return (
    <React.Fragment>
      <DialogTrigger>
        <div className="user-shopping-icon" style={{marginLeft: "auto"}}>
          <ActionButton marginEnd="2rem">Login</ActionButton>
        </div>
        {close => (
          <Dialog>
            <Heading>Sign in to Brent</Heading>
            <Divider />
            <Content>
              <Form validationBehavior="native">
                <Flex gap="size-400" direction="column">
                  <Flex direction="row" gap="size-100">
                    <TextField
                      autoFocus
                      label="Email Address"
                      value={email}
                      isRequired
                      onChange={setEmail}
                      name="email"
                    />
                    <TextField
                      id="password"
                      label="Password"
                      type="password"
                      value={password}
                      isRequired
                      name="password"
                      onChange={setPassword}
                      onKeyDown={e => handleKeyDown(e)}
                    />
                  </Flex>
                  <ButtonGroup align="end">
                    <Flex direction="row" gap="size-100">
                      <ActionButton type="reset" onClick={close}>
                        Cancel
                      </ActionButton>
                      <ActionButton onClick={close}>Request account</ActionButton>
                      <ActionButton
                        // type="submit"
                        onClick={(e) => {
                          handleClickSignIn(e)
                          close()
                        }}
                      >
                        Sign in
                      </ActionButton>
                    </Flex>
                  </ButtonGroup>
                </Flex>
              </Form>
            </Content>
          </Dialog>
        )}
      </DialogTrigger>

      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Book your own equipment after you log in.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={onEmailChange}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={onPasswordChange}
            onKeyDown={e => test(e)}
          />
        </DialogContent>
        <DialogActions>
          <ActionButton onClick={handleClose}>Request account</ActionButton>
          <ActionButton onClick={handleClose}>Cancel</ActionButton>
          <ActionButton type="submit" onClick={handleClickSignIn}>
            Sign in
          </ActionButton>
        </DialogActions>
      </Dialog> */}
    </React.Fragment>
  )
}

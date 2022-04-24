import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import {Form, InputGroup, Alert} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useAdminContext } from "../lib/adminContext";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const allowedEmailAlias = "@daikin.com.my";
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const { LoginAsAdmin } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  const [userGroup, setUserGroup] = useState("Admin");
  useEffect(() => {
    //console.log('Current Group:', userGroup);
  }, [userGroup]);

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    //console.log('Current Group:', userGroup);
  }, [isLogin]);

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn((fields.email+allowedEmailAlias), fields.password);
      LoginAsAdmin(false);

      (async () => {
        if(await checkGroup()){
          if(userGroup === "Admin"){
            LoginAsAdmin(true);
          }else(LoginAsAdmin(false))
          setIsLogin(true);
          userHasAuthenticated(true);
          history.push("/");
        }
        else{
          await Auth.signOut(); // force log out to prevent account hooking from previous Auth.signIn
          userHasAuthenticated(false);
          history.push("/login/unauthenticate");
          //handleNotInGroup();
        }
      })();
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function checkGroup() {
    const user = await Auth.currentAuthenticatedUser();
    const usergroup = user.signInUserSession.accessToken.payload["cognito:groups"]
    return(usergroup.includes(userGroup));
  }

  function handleChange (event) {
    setUserGroup(event.target.value);
  }

  function handleNotInGroup(){
    return (
      <Alert variant="danger">
      <Alert.Heading>
      Your account is not authenticated in this particular group.
      </Alert.Heading>
      <hr />
      <p>
      <Link to="/login">
          Click here to login with another group.
      </Link>
      </p>
      </Alert>
      );
  }


  return (
    (!isLogin) ?
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <InputGroup>
          <Form.Control
            autoFocus
            type="text"
            placeholder="Your Email"
            value={fields.email}
            onChange={handleFieldChange}
          />
          <InputGroup.Text>{allowedEmailAlias}</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your Password"
            value={fields.password}
            onChange={handleFieldChange}
          />
          <Link to="/login/reset" style={{paddingTop:8}}>Forgot password?</Link>
        </Form.Group>
        <Form.Group size="lg" controlId="group">
          <Form.Control as="select" value={userGroup} onChange={handleChange}>
            <option value="Admin">Admin</option>
            <option value="DRDM">DRDM</option>
          </Form.Control>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
    : handleNotInGroup()
  );
}
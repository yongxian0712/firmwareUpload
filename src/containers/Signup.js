import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import "./Signup.css";
import { Auth } from "aws-amplify";


export default function Signup() {
  
  const allowedEmailAlias = "@daikin.com.my";
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      const newUser = await Auth.signUp({
        username: (fields.email + allowedEmailAlias),
        password: fields.password,
        attributes:{
          preferred_username: fields.username
        }
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  async function handleConfirmationSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      await Auth.confirmSignUp((fields.email + allowedEmailAlias), fields.confirmationCode);
      await Auth.signIn((fields.email + allowedEmailAlias), fields.password);
  
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleResendCode(event) {
    event.preventDefault();
    try{
      await Auth.resendSignUp((fields.email + allowedEmailAlias));
    }
    catch(e){
      onError(e);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted >Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
        <div class="text-muted" style={{paddingTop:6, fontSize:12, fontWeight:"lighter"}}>
          Didn't get a Code? <a className="link" href="#0" onClick={handleResendCode}>Resend Code</a>
        </div>
      </Form>
    );
  }

  const textStyle = {
    textAlign: 'justify'
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" size="lg">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            placeholder="Your Username"
            value={fields.username}
            onChange={handleFieldChange}
          />
          <Form.Text className="text-muted" style={textStyle}>
            This username is not used for Login. You are able to change after signing up.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <InputGroup type="text">
            <Form.Control
              type="text"
              placeholder="Your Email"
              value={fields.email}
              onChange={handleFieldChange}
            />
            <InputGroup.Text>{allowedEmailAlias}</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your Password"
            value={fields.password}
            onChange={handleFieldChange}
          />
          <Form.Text className="text-muted" style={textStyle}>
            Password must be at least 8 characters, consist of numbers, uppercase and lowercase letter.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
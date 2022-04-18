import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { FormGroup, FormControl, FormLabel, Alert } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [fields, handleFieldChange] = useFormFields({
    password: "",
    oldPassword: "",
    confirmPassword: "",
  });
  const [isChanging, setIsChanging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function validateForm() {
    return (
      fields.oldPassword.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function renderSuccessMessage() {

    return (
      <Alert variant="success">
      <Alert.Heading>
        Your password has changed.
      </Alert.Heading>
        <hr />
        <p>
        <Link to="/">
            Return to the Home page.
        </Link>
        </p>
      </Alert>
    );
  }

  async function handleChangeClick(event) {
    event.preventDefault();

    setIsChanging(true);

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        fields.oldPassword,
        fields.password
      );

      setConfirmed(true);
      renderSuccessMessage();

    } catch (error) {
      onError(error);
      setIsChanging(false);
    }
  }

  return (
    (!confirmed) ?
    <div className="ChangePassword">
      <form onSubmit={handleChangeClick}>
        <FormGroup size="lg" controlId="oldPassword">
          <FormLabel>Old Password</FormLabel>
          <FormControl
            autoFocus
            type="password"
            placeholder="Enter your old password"
            onChange={handleFieldChange}
            value={fields.oldPassword}
          />
        </FormGroup>
        <hr />
        <FormGroup size="lg" controlId="password">
          <FormLabel>New Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter a new password"
            onChange={handleFieldChange}
            value={fields.password}
          />
        </FormGroup>
        <FormGroup size="lg" controlId="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter again your new password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          size="lg"
          disabled={!validateForm()}
          isLoading={isChanging}
        >
          Change Password
        </LoaderButton>
      </form>
    </div>
    :renderSuccessMessage()
  );
}
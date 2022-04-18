import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NotAuthenticatedUser.css"

export default function NotAuthenticatedUser(){
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
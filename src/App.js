import React, { useState, useEffect } from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "./lib/errorLib";

function App() {

const [isAuthenticated, userHasAuthenticated] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
const [isAuthenticating, setIsAuthenticating] = useState(true);
const history = useHistory();

console.log(isAdmin)

useEffect(() => {
  onLoad();
}, []);

async function onLoad() {
  try {
    await Auth.currentSession();
    await Auth.currentAuthenticatedUser()
    .then(data => (
       (console.log(data.signInUserSession.accessToken.payload["cognito:groups"])))
    )
    .catch(err => console.log(err));
      
    userHasAuthenticated(true);
  }
  catch(e) {
    if (e !== 'No current user') {
      onError(e);
    }
  }

  setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
    history.push("/login");
  }

  function NonAdminControl(){
    return(
      <>
        <NavDropdown title="Setting" id="basic-nav-dropdown">
          <NavDropdown.Item href="/settings/password">
              Change Password
          </NavDropdown.Item>
        </NavDropdown>
        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
      </> 
    )
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              Daikin Research and Development
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                {isAdmin ? (
                  <>
                  <NavDropdown title="Admin Management" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/admin/thingManagement">
                      IoT Thing Management
                    </NavDropdown.Item>
                  </NavDropdown>
                  {NonAdminControl()}
                  </>
                  ): ( 
                  <>
                  {NonAdminControl()}
                  </>
                  )}
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}
export default App;
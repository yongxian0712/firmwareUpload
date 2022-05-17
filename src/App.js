import React, { useState, useEffect } from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { adminContext } from "./lib/adminContext";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "./lib/errorLib";
import {GrUser, GrUserAdmin} from "react-icons/gr"

function App() {

const [isAuthenticated, userHasAuthenticated] = useState(false);
const [isAuthenticating, setIsAuthenticating] = useState(true);
const history = useHistory();
const [name, setName] = useState();
const [isAdmin, LoginAsAdmin] = useState(false);

useEffect(() => {
  onLoad();
}, []);

console.log(isAdmin)

  async function onLoad() {
    try {
      await Auth.currentSession();
      const user = await Auth.currentAuthenticatedUser();
      userHasAuthenticated(true);
      setName(user.attributes.preferred_username);
      const usergroup = user.signInUserSession.accessToken.payload["cognito:groups"]
      if(usergroup.includes("Admin")){
        LoginAsAdmin(true);
      }
      else{
        LoginAsAdmin(false);
      }
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
    LoginAsAdmin(false);
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
            {!isAuthenticated ? (
            <Navbar.Brand className="font-weight-bold text-muted">
              Daikin Research and Development
            </Navbar.Brand>
            ):(
            <Navbar.Brand className="font-weight-bold text-muted">
              {!isAdmin ? <GrUser className="profilePic"/> : <GrUserAdmin className="profilePic"/>} <span className="profile">Welcome, {name}</span>
            </Navbar.Brand>
            )}
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              
              {isAuthenticated ? (
                <>

                {isAdmin ? (
                  <>
                  <NavDropdown title="Admin Management" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/admin/IoTManagement">
                      IoT Management
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
        <adminContext.Provider value={{isAdmin, LoginAsAdmin}}>
          <Routes />  
        </adminContext.Provider>    
        </AppContext.Provider>
      
      </div>

    )
  );
}
export default App;
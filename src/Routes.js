import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import ResetPassword from "./containers/ResetPassword";
import ChangePassword from "./containers/ChangePassword";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import NotAuthenticatedUser from "./containers/NotAuthenticatedUser";
import IoTManagement from "./containers/IoTManagement";
import AdminRoute from "./components/AdminRoute";
export default function Routes() {
  return (
    <Switch>
        <Route exact path="/">
            <Home />
        </Route>
      
        <UnauthenticatedRoute exact path="/login">
            <Login />
        </UnauthenticatedRoute>

        <UnauthenticatedRoute exact path="/login/unauthenticate">
            <NotAuthenticatedUser />
        </UnauthenticatedRoute>

        <UnauthenticatedRoute exact path="/signup">
            <Signup />
        </UnauthenticatedRoute>

        <AuthenticatedRoute exact path="/settings/password">
            <ChangePassword />
        </AuthenticatedRoute>

        <AdminRoute exact path="/admin/IoTManagement">
            <IoTManagement />
        </AdminRoute>

        <UnauthenticatedRoute exact path="/login/reset">
            <ResetPassword />
        </UnauthenticatedRoute>

    {/* Finally, catch all unmatched routes */}
        <Route>
            <NotFound />
        </Route>
    </Switch>
  );
}
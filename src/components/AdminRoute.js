import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAdminContext } from "../lib/adminContext";

export default function AdminRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const { isAdmin } = useAdminContext();
  return (
    <Route {...rest}>
      {isAdmin ? (
        children
      ) : (
        <Redirect to={
          `/login?redirect=${pathname}${search}`
        } />
      )}
    </Route>
  );
}
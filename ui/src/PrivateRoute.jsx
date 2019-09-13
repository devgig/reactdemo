import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";

function PrivateRoute({ component: Component, claims, ...rest }) {
  return (
    <AuthContext.Consumer>
      {auth => (
        <Route
          {...rest}
          render={props => {
            // 1. Redirect to login if not logged in.
            if (!auth.isAuthenticated()) return auth.login();

            // 2. Display message if user lacks required scope(s).
            if (claims.length > 0 && !auth.userHasClaims(claims)) {
              return (
                <h1>
                  Unauthorized - You need the following claims(s) to view this
                  page: {claims.join(",")}.
                </h1>
              );
            }

            // 3. Render component
            return <Component auth={auth} {...props} />;
          }}
        />
      )}
    </AuthContext.Consumer>
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  claims: PropTypes.array
};

PrivateRoute.defaultProps = {
  claims: []
};

export default PrivateRoute;

import React from "react";
import { Route } from "react-router-dom";
import { useHistory } from "react-router-dom";

const PrivateRoute = (props) => {
  const history = useHistory();
  const { component: Component, ...restProps } = props;
  return (
    <Route
      {...restProps}
      render={(props) =>
          localStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
          history.replace("/")
        )
      }
    />
  );
};

export default PrivateRoute;
import React from "react"
import { Redirect, Route } from "react-router-dom"

const PrivateRoute = ({ component: Component, ...rest }) => {
  //State
  console.log({ ...rest })

  return (
    <Route
      {...rest}
      render={(props) =>
        (localStorage.getItem("carvalueId")) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/account/login", state: { from: props.location } }}
          />
        )
      }
    />
  )
}

export default PrivateRoute

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Profile from "./components/Profile";
import logo from "../src/car-icon.png";
import AppNav from "./components/AppNav";
import Rental from "./components/Rental";
import Auth from "./auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import AuthContext from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history),
      tokenRenewalComplete: false
    };
  }

  componentDidMount() {
    this.state.auth.renewToken(() =>
      this.setState({ tokenRenewalComplete: true })
    );
  }

  render() {
    const { auth } = this.state;
    // Show loading message until the token renewal check is completed.
    if (!this.state.tokenRenewalComplete) return "Loading...";
    return (
      <AuthContext.Provider value={auth}>
        <AppNav auth={auth} />
        <div>
          <Route
            exact
            path="/"
            render={props => <Home auth={auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback auth={auth} {...props} />}
          />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute
            path="/rental"
            component={Rental}
            claims={["read:rental"]}
          />
          <Route path="/public" component={Public} />
          <PrivateRoute path="/private" component={Private} />
          <PrivateRoute
            path="/courses"
            component={Courses}
            claims={["read:courses"]}
          />
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;

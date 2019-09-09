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

class App extends Component {
  constructor(props) {
    super(props);

    this.auth = new Auth(this.props.history);
  }

  render() {
    const { isAuthenticated, login } = this.auth;
    return (
      <>
        <AppNav auth={this.auth} />
        <Route
          exact
          path="/"
          render={props => <Home auth={this.auth} {...props} />}
        />
        <Route
          path="/callback"
          render={props => <Callback auth={this.auth} {...props} />}
        />
        <Route
          path="/profile"
          render={props =>
            isAuthenticated() ? (
              <Profile auth={this.auth} {...props} />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route
          path="/rental"
          reander={props =>
            isAuthenticated() ? (
              <Rental auth={this.auth} {...props} />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route path="/public" component={Public} />
        <Route
          path="/private"
          render={props =>
            isAuthenticated() ? (
              <Private auth={this.auth} {...props} />
            ) : (
              login()
            )
          }
        />
        <Route
          path="/courses"
          render={props =>
            isAuthenticated() && this.auth.userHasScopes(["read:courses"]) ? (
              <Courses auth={this.auth} {...props} />
            ) : (
              login()
            )
          }
        />
        <img src={logo} className="App-logo" alt="logo" />
      </>
    );
  }
}

export default App;

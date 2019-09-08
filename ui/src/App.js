import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Profile from "./components/Profile";
import logo from "../src/car-icon.png";
import AppNav from "./components/AppNav";
import Rental from "./components/Rental";
import Auth from "./auth/Auth";
import Callback from "./Callback";

class App extends Component {
  constructor(props) {
    super(props);

    this.auth = new Auth(this.props.history);
  }
  render() {
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
        <Route path="/profile" component={Profile} />
        <Route path="/rental" component={Rental} />
        <img src={logo} className="App-logo" alt="logo" />
      </>
    );
  }
}

export default App;

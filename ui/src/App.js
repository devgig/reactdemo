import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Profile from "./components/Profile";
import logo from '../src/car-icon.png';
import AppNav from './components/AppNav';
import Rental from "./components/Rental";

class App extends Component {
  
  render() {
    return (
      <>
        <AppNav/>
        <Route exact path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/rental" component={Rental} />
        <img src={logo} className="App-logo" alt="logo" />
      </>
    );
  }
}

export default App;

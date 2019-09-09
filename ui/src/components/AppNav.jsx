import React, { Component } from "react";
import {
  Navbar,
  NavItem,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavLink
} from "reactstrap";

class AppNav extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleClick = e => {
    e.preventDefault();
    const { isAuthenticated, login, logout } = this.props.auth;
    if (isAuthenticated()) logout();
    else login();
  };

  render() {
    const { isAuthenticated, userHasScopes } = this.props.auth;
    return (
      <div>
        <Navbar color="inverse" light expand="md">
          <NavbarBrand href="/">Tura</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/profile">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/public">Public</NavLink>
              </NavItem>
              {isAuthenticated() && (
                <NavItem>
                  <NavLink href="/rental">Rentals</NavLink>
                </NavItem>
              )}
              {isAuthenticated() && userHasScopes(["read:courses"]) && (
                <NavItem>
                  <NavLink href="/courses">Courses</NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink href="/private">Private</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={this.handleClick}>
                  {isAuthenticated() ? "Logout" : "Login"}
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default AppNav;

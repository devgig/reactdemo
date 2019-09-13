import React, { Component } from "react";
import { NavLink} from "react-router-dom";

import {
  Navbar,
  NavItem,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavLink as RRNavLink,
} from "reactstrap";

class AppNav extends Component {
  constructor(props) {
    super(props);
    this.history = this.props.history;
    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleNavItemClick = this.handleNavItemClick.bind(this);

    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleNavItemClick() {
    if(this.state.isOpen)
      this.setState({ isOpen : false});
  }

  handleClick = e => {
    e.preventDefault();
    const { isAuthenticated, login, logout } = this.props.auth;
    if (isAuthenticated()) logout();
    else login();
  };

  render() {
    const { isAuthenticated, userHasClaims } = this.props.auth;
    return (
      <div>
        <Navbar color="inverse" light expand="md">
            <NavLink 
            className="navbar-brand"
            activeClassName="active"
            tag={NavbarBrand}
              to='/'
            >
              Tura
            </NavLink>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink
                  to="/profile"
                  className="nav-link"
                  activeClassName="active"
                  tag={RRNavLink}
                  onClick={this.handleNavItemClick}
                >
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/public"
                  className="nav-link"
                  activeClassName="active"
                  tag={RRNavLink}
                  onClick={this.handleNavItemClick}
                >
                  Public
                </NavLink>
              </NavItem>
              {isAuthenticated() && (
                <NavItem>
                  <NavLink
                    to="/rental"
                    className="nav-link"
                    activeClassName="active"
                    tag={RRNavLink}
                    onClick={this.handleNavItemClick}
                  >
                    Rentals
                  </NavLink>
                </NavItem>
              )}
              {isAuthenticated() && userHasClaims(["read:rental"]) && (
                <NavItem>
                  <NavLink
                    to="/courses"
                    className="nav-link"
                    activeClassName="active"
                    tag={RRNavLink}
                    onClick={this.handleNavItemClick}
                  >
                    Courses
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink
                  to="/private"
                  className="nav-link"
                  activeClassName="active"
                  tag={RRNavLink}
                  onClick={this.handleNavItemClick}
                >
                  Private
                </NavLink>
              </NavItem>
              <NavItem>
                <RRNavLink href="#" onClick={this.handleClick}>
                  {isAuthenticated() ? "Logout" : "Login"}
                </RRNavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default AppNav;

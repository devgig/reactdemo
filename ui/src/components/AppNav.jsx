import React, { Component } from "react";
import {
    Navbar,
    NavItem,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    NavLink
} from 'reactstrap';

class AppNav extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
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
                <NavLink href="/rental">Rentals</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default AppNav;

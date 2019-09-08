import React, { Component } from "react";
import { Jumbotron, Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;
    return (
      <div>
        <Jumbotron>
          <Container>
            <Row>
              <h2>Home</h2>
            </Row>
            <Row>
              {isAuthenticated() ? (
                <Link to="/profile">View Profile</Link>
              ) : (
                <></>
              )}
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;

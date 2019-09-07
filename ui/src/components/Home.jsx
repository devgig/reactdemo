import React, { Component } from "react";
import { Jumbotron, Container, Row, Col } from "reactstrap";

class Home extends Component {
  render() {
    return (
      <div>
        <Jumbotron>
          <Container>
            <Row>
              <Col colSpan="2">
                <h3>Login</h3>
              </Col>
            </Row>
            <Row>
              <Col>User Name</Col>
              <Col>{/* <input value={userName}></input> */}</Col>
            </Row>
            <Row>
              <Col>Password</Col>
              <Col>{/* <input value={userPwd}></input> */}</Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;

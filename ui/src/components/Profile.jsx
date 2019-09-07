import React, { Component } from "react";
import {
  Jumbotron,
  Container,
  Row,
  Col
} from 'reactstrap';

class Profile extends Component {
  render() {
    return (
      <Jumbotron>
        <Container>
          <Row>
            <Col>
              <h2>Profile</h2>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default Profile;

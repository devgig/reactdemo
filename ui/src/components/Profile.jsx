import React, { Component } from "react";
import { Jumbotron, Container, Row } from "reactstrap";

class Profile extends Component {
  state = {
    profile: null,
    error: ""
  };

  componentDidMount() {
    this.loadUserProfile();
  }

  loadUserProfile = () => {
    this.props.auth.getProfile((profile, error) => {
      this.setState({ profile, error });
    });
  };
  render() {
    const {profile} = this.state;
    if(!profile) return null;

    const imageStyle = {
      maxWidth: "50px",
      maxHeight: "50px"
    };

    return (
      <Jumbotron>
        <Container>
          <Row>
            <h2>Profile</h2>
          </Row>
          <Row>
            <p>{profile.nickname}</p>
          </Row>
          <Row>
            <img
              style={imageStyle}
              src={profile.picture}
              alt="profile pic"
            ></img>
          </Row>
          <Row>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default Profile;

import React, { Component } from "react";
import { axiosInstance } from "../auth/Auth";
import { Jumbotron, Container, Row, Col } from "reactstrap";

class Rental extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      makes: [],
      models: [],
    };
  }

  componentDidMount = () => {
    axiosInstance
      .get(`${process.env.REACT_API}/api/v1/rental/getall`)
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => {
        this.setState({ isLoaded: true, makes: data });
      })
      .catch((error) => {
        this.setState(error);
        console.log(error.message);
      });
  };

  handleMakeChange = (event) => {
    axiosInstance
      .get(
        `${process.env.REACT_API}/api/v1/rental/getbycriteria/${event.target.value}`
      )
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => {
        this.setState({ isLoaded: true, models: data });
      })
      .catch((error) => {
        this.setState(error);
        console.log(error);
      });
  };

  render() {
    const divStyle = {
      margin: "10px",
      color: "red",
    };

    const selectStyle = {
      width: "500px",
    };

    const { error, isLoaded, makes, models } = this.state;
    if (error) {
      return <div style={divStyle}>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <span>
                  <label>Make</label>
                  <select
                    style={selectStyle}
                    className="form-control"
                    id="showMake"
                    onChange={this.handleMakeChange}
                  >
                    {makes.map((item) => (
                      <option key={item.id} value={item.make}>
                        {item.make}
                      </option>
                    ))}
                  </select>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span>
                  <label>Model</label>
                  <select
                    style={selectStyle}
                    className="form-control"
                    id="showModel"
                  >
                    {models.map((item) => (
                      <option key={item.id} value={item.make}>
                        {item.model}
                      </option>
                    ))}
                  </select>
                </span>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      );
    }
  }
}

export default Rental;

import React, { Component } from "react";
import axios from "axios";
import {
    Jumbotron,
    Container,
    Row,
    Col
} from 'reactstrap';

class Rental extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      makes: [],
      models: []
    };
  }

  componentDidMount = () => {
    axios
      .get("https://localhost:5001/api/v1/Rental/GetAll")
      .then(result => {
        this.setState({ isLoaded: true, makes: result.data });
      })
      .catch(error => {
        this.setState({ isLoaded: true, error });
      });
  };

  handleMakeChange = event => {
    axios
      .get(
        `https://localhost:5001/api/v1/Rental/GetByCriteria/${event.target.value}`
      )
      .then(result => {
        this.setState({ models: result.data });
      })
      .catch(error => {
        this.setState(error);
      });
  };

  render() {
    const divStyle = {
      margin: "10px",
      color: "red"
    };

    const selectStyle = {
      width: "500px"
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
                  {makes.map(item => (
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
                  {models.map(item => (
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

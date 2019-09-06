import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    Row,
    Col,
    Jumbotron,
    Button
} from 'reactstrap';
import logo from './car-icon.png';
import './App.css';
import Rentals from './components/Rentals/Rentals';
import { userInfo } from 'os';

class App extends Component {
    constructor(props) {
        super(props);

        this.toggle = this
            .toggle
            .bind(this);
        this.state = {
            isOpen: false,
            userName: null,
            userPwd: null
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
                <Router>
                    <Navbar color="inverse" light expand="md">
                        <NavbarBrand href="/">Tura</NavbarBrand>
                        <NavbarToggler onClick={this.toggle}/>
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink href="/rentals">Rentals</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                    <Route exact path="/" component={Home}/>
                    <Route path="/rentals" component={Rentals}/>
                </Router>
                <img src={logo} className="App-logo" alt="logo"/>
            </div>

        );
    }
}

function Home() {
    const {userName, userPwd} = this.state;
    return (
        <Jumbotron>
            <Container>
                <Row>
                    <Col colSpan='2'>
                        <h3>Login</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>User Name</Col>
                    <Col><input value={userName}></input></Col>
                </Row>
                <Row>
                    <Col>Password</Col>
                    <Col><input value={userPwd}></input></Col>
                </Row>
            </Container>
        </Jumbotron>
    );
}

export default App;

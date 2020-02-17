import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from "./Components/SignIn/SignIn.js"
import SignUp from "./Components/SignUp/SignUp.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route,Switch, Link } from "react-router-dom";
import { Navbar , Button, Nav , ButtonToolbar } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
     	<Router>
      <Navbar bg="dark" variant="dark">
           <Navbar.Brand href="/">Miss-Loc</Navbar.Brand>
           <Nav className="mr-auto">           
        </Nav>
        <ButtonToolbar>
     <Link to='/signin'><Button style={{marginRight:"4px"}}variant="primary">Sign In</Button></Link>
        <Link to='/signup'><Button variant="secondary">Sign Up</Button></Link>
        </ButtonToolbar>
  </Navbar>

			<Route path="/signup" component={SignUp} />
			<Route path="/signin" component={SignIn} />


     	</Router>

    );
  }
}

export default App;

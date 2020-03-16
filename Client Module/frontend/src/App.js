import React, { Component } from 'react';
import './App.css';
import SignIn from "./Components/SignIn/SignIn.js"
import SignUp from "./Components/SignUp/SignUp.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route,Switch, Link } from "react-router-dom";
import { Navbar , Button, Nav , ButtonToolbar } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
     	<Router >
      <Navbar bg="dark" variant="dark" fixed ='top'>
           <Navbar.Brand href="/">Miss-Loc</Navbar.Brand>
           <Nav className="mr-auto">           
        </Nav>
        <ButtonToolbar>
     <Link to='/signin'><Button style={{marginRight:"4px"}}variant="primary">Sign In</Button></Link>
        <Link to='/signup'><Button variant="secondary">Sign Up</Button></Link>
        </ButtonToolbar>
  </Navbar>
    <div id="dust">
</div>
<div class="title">
  <h1>
    <div>
      MISSING  <span>PERSON</span>
    </div>
    <div>LOCATOR</div>
  </h1>
  <p id='tagline'>
         Seek. The. CyberSpace.
</p>
</div>
			<Route path="/signup" component={SignUp} />
			<Route path="/signin" component={SignIn} />


     	</Router>

    );
  }
}

export default App;

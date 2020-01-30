import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from "./Components/SignIn/SignIn.js"
import SignUp from "./Components/SignUp/SignUp.js"

import { BrowserRouter as Router, Route,Switch, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
     	<Router>

 

			<Link to='/signin'><button>Sign In</button></Link>
			<Link to='/signup'><button>Sign Up</button></Link>

			<Route path="/signup" component={SignUp} />
			<Route path="/signin" component={SignIn} />


     	</Router>

    );
  }
}

export default App;

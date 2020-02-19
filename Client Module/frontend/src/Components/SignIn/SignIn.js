import React,{Component} from 'react';
import { BrowserRouter as Router, Route,Switch, Link } from "react-router-dom";
import ForgotPassword from '../ForgotPassword/ForgotPassword.js'
import SignUp from '../SignUp/SignUp.js'

import {Card ,Button ,Form} from 'react-bootstrap'
import './SignIn.css'

class SignIn extends Component{
	constructor(props){
		super(props);
		this.state={
			username:'',
			password:''	,
		};
	}

	changeHandler = (event) => {
		let name=event.target.name;
		let val=event.target.value;
		this.setState({[name]:val});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		let data={
			username:this.state.username,
			password:this.state.password
		}
	let body_data=JSON.stringify(data);
	
	var url="http://127.0.0.1:8080/signin"
	var request= {
		method:"POST",
		body:body_data,
		headers: {
              "Content-Type":"application/json",
              "Access-Control-Allow-Origin":"*",
              'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept'
            }
	}	

	fetch(url,request)
	.then(function(response){

		if(response.status!=200){
			console.log("An Error has occured with status code"+response.status)
		}
		else{
			response.json().then(function(data){
			console.log(data.key)
		});
	
		}
		
	})
	.catch(function(error){
		console.log("ERROR-"+error);
	})

	}
	render(){
		return(
				<Router>
				<div id='container-signin'>
					<form onSubmit={this.handleSubmit}>
						<Card className="text-center">
							  <Card.Header>Sign In</Card.Header>
							  <Card.Body>
							    <Card.Text>
									     <Form.Group >
										    <Form.Control type="text" placeholder="Enter Username" name="username" onChange={this.changeHandler} required/>
										  									  
										    </Form.Group>
										  <Form.Group >
										    <Form.Control type="password" placeholder="Enter Password" name="password" onChange={this.changeHandler} required/>
										  </Form.Group>
										 </Card.Text>

									    <Button variant="primary" type="submit">Login</Button>
									    <br/>
									    <Link to='/forgot'><Button variant="light" id="ForgotPassword">Forgot your password?</Button></Link>

							  </Card.Body>
							  <Card.Footer className="text-muted">Not a member yet ? <a href="/signup">Join here</a></Card.Footer>
						</Card>
					</form>

				</div>



				<Route path="/forgot" component={ForgotPassword} />
				<Route path="/signup" component={SignUp} />

				</Router>
			)
	}
}
export default SignIn;
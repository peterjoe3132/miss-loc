import React,{Component} from 'react';
import { BrowserRouter as Router, Route,Switch, Link } from "react-router-dom";
import ForgotPassword from '../ForgotPassword/ForgotPassword.js'

class SignIn extends Component{
	constructor(props){
		super(props);
		this.state={
			username:'',
			password:''			
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
				<div>
					<form onSubmit={this.handleSubmit}>
					<input 
					type="text"
					placeholder="username"
					name="username"
					onChange={this.changeHandler}
					/>
					<br/>
					<input 
					type="password"
					placeholder="password"
					name="password"
					onChange={this.changeHandler}
					/>
					<br/>
					<Link to='/forgot'><button>ForgotPassword</button></Link>
					<button type="submit">Login</button>
					</form>
				</div>
				<Route path="/forgot" component={ForgotPassword} />
				</Router>
			)
	}
}
export default SignIn;
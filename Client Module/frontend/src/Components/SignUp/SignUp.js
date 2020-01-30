import React,{Component} from 'react'

class SignUp extends Component{
	constructor(props){
		super(props);

		this.state={
			username:'',
			password:'',
			email:'',
			fullname:''
		};
	}
	changeHandler=(event)=>{
		var key=event.target.name;
		var val=event.target.value;
		this.setState({[key]:val});
	}
	handleSubmit=(event)=>{
		event.preventDefault();
		let data={
			fullname:this.state.fullname,
			email:this.state.email,
			username: this.state.username,
			password:this.state.password
		}

		let body_data=JSON.stringify(data);
		var url='http://127.0.0.1:8080/signup';

		// console.log(body_data)

		var request={
			method:"POST",
			body:body_data,
			headers:{
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept'           
			}
		}

		fetch(url,request)
		.then(function(response){
			if(response.status!=200){
				console.log("An Error has occured with code "+response.status);
			}
			else{
				response.json().then(function(data){
					console.log(data);
				})
			}
		});
		// .catch(function(error){
		// console.log("ERROR-"+error);
		// })
	}

	render(){
		return(
				<form onSubmit={this.handleSubmit}>
					<input 
					type="text"
					placeholder="fullname"
					name="fullname"
					onChange={this.changeHandler}
					/>
					<br/>
					<input 
					type="email"
					placeholder="email"
					name="email"
					onChange={this.changeHandler}
					/>
					<br/>
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
					<button type="submit">Sign Up</button>
				</form>		

			)
	}
}
export default SignUp
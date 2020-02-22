import React,{Component} from 'react'
import './SignUp.css'
import { Card ,Button,Form} from 'react-bootstrap'

class SignUp extends Component{
	constructor(props){
		super(props);

		this.state={
			username:'',
			password:'',
			email:'',
			fullname:'',
			confirm_password:'',
			username_taken:false
		};
	}
	changeHandler=(event)=>{
		var key=event.target.name;
		var val=event.target.value;
		this.setState({[key]:val});
	}
	handleSubmit=(event)=>{

		const { password ,confirm_password}=this.state;

		if(password != confirm_password){
			alert("password dont match");
		}
		else {
		event.preventDefault();
		let data={
			fullname:this.state.fullname,
			email:this.state.email,
			username: this.state.username,
			password:this.state.password
		}

		let body_data=JSON.stringify(data);
		var url='http://127.0.0.1:8080/signup';

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
	}

	render(){
		return(
				
					<div id='container-signup'>
					<form onSubmit={this.handleSubmit}>
						<Card className="text-center">
						  <Card.Header>Sign Up</Card.Header>
						  <Card.Body>
						    <Card.Text>
						    		 <Form.Group >								    
									    <Form.Control type="text" placeholder=" Name " name="fullname" onChange={this.changeHandler} />
									  </Form.Group> 
									  <Form.Group >								    
									    <Form.Control type="email" placeholder=" Email " name="email" onChange={this.changeHandler} />
									  </Form.Group>
									  <Form.Group >								    
									    <Form.Control type="text" placeholder=" Username " name="username" onChange={this.changeHandler} />
									  </Form.Group>
									   <Form.Group >								    
									    <Form.Control type="password" placeholder=" Password " name="password" onChange={this.changeHandler} />
									  </Form.Group>
									   <Form.Group >								    
									    <Form.Control type="password" placeholder=" Confirm Password " name="confirm-password" onChange={this.changeHandler} />
									  </Form.Group>
						    </Card.Text>
						    <Button variant="success" type='submit'> Sign Up</Button>
						  </Card.Body>
						  <Card.Footer className="text-muted">Already a member ? Login <a href='/signin'>here</a></Card.Footer>
						</Card>
						</form>
					</div>
							
			)
	}
}
export default SignUp
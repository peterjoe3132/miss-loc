import React,{Component} from 'react'
import './SignUp.css'
import { Card ,Button,Form,Alert} from 'react-bootstrap'
import SignIn from '../SignIn/SignIn.js'
import check from '../Assets/check-circle.gif'


class SignUp extends Component{
	constructor(props){
		super(props);

		this.state={
			username:'',
			password:'',
			email:'',
			fullname:'',
			confirm_password:'',
			username_exist:false,
			password_match:false,
			password_short:false,
			signup_success:false
		};
	}
	changeHandler=(event)=>{
		var key=event.target.name;
		var val=event.target.value;
		this.setState({[key]:val});
	}

	set_state=(state_to_be_set,val)=>{
		this.setState({
			[state_to_be_set]:val
		});
	}
	submit_form=(event)=>{
		const { password ,confirm_password,username_exist,password_match,password_short }=this.state;
		const pointerToThis=this;
		console.log(password.length)
		if(password.length<8){
			pointerToThis.set_state('password_short',true);
			pointerToThis.set_state('password_match',false);

		}
		else{
		if(password != confirm_password){
			pointerToThis.set_state('password_match',true);
			pointerToThis.set_state('password_short',false);
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
					if(data.key=='0040'){
						pointerToThis.set_state('username_exist',true);
						pointerToThis.set_state('password_match',false);
						pointerToThis.set_state('password_short',false);

					}
					else 
						if(data.key=='0050'){
						pointerToThis.set_state('username_exist',false);	
						pointerToThis.set_state('signup_success',true);
					
						}
				})
			}
		});
		// .catch(function(error){
		// console.log("ERROR-"+error);
		// })
		}
		}
	}

	render(){
		return(
				
					<div id='container-signup'>
					<form>
						<Card className="text-center">
						  <Card.Header>Sign Up</Card.Header>
						  <Card.Body>
						    <Card.Text>
						    		 <Form.Group >								    
									    <Form.Control type="text" placeholder=" Name " name="fullname" required onChange={this.changeHandler} />
									  </Form.Group> 
									  <Form.Group >								    
									    <Form.Control type="email" placeholder=" Email " name="email" required onChange={this.changeHandler} />
									  </Form.Group>
									  <Form.Group >								    
									    <Form.Control type="text" placeholder=" Username " name="username" required onChange={this.changeHandler} />
									  </Form.Group>
									   <Form.Group >								    
									    <Form.Control type="password" placeholder=" Password " name="password" required minLength={8} maxLength={16} onChange={this.changeHandler}  />
									    <div className="text-muted" id='password-help'>
									     Minimum 8 characters.
									    </div>
									  </Form.Group>
									   <Form.Group >								    
									    <Form.Control type="password" placeholder=" Confirm Password "  name="confirm_password" required onChange={this.changeHandler} />
									  </Form.Group>
						    </Card.Text>
						    <Button variant="success"  type='submit' onClick={this.submit_form}> Sign Up</Button>
						  </Card.Body>
						  <Card.Footer className="text-muted">Already a member ? Login <a href='/signin'>here</a></Card.Footer>
						</Card>
						{	this.state.password_short &&
							<Alert variant='secondary'>
								Password too short !
							</Alert>	
						}
						{	this.state.password_match &&
							<Alert variant='warning'>
								Passwords don't match !
							</Alert>	
						}
						{	this.state.username_exist &&
							<Alert variant='danger'>
								Username Already exists ,please try something else 
							</Alert>	
						}
						{	this.state.signup_success &&
							
							<Alert variant='success' id='success-signup'>
							  <h4><Alert.Heading>Account created successfully !</Alert.Heading></h4>
								 <div id='success-gif'>
								 <img src={check} />
								 </div>
								 <span id='success-text'>
								<h5> {this.state.fullname} Please Sign In-><a href="/signin">here</a> </h5>
								 </span>
							</Alert>					
						}		
						</form>
					</div>
							
			)
	}
}
export default SignUp
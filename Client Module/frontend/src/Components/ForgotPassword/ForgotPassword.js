import React,{Component} from 'react'
import './ForgotPassword.css'
import {Card,Button,Form,Row,Col,Alert } from 'react-bootstrap'
import check from '../Assets/check-circle.gif'


class ForgotPassword extends Component{
	constructor(props){
		super(props);
		this.state={
			email:'',
			code:'',
			password:'',
			confirm_password:'',
			invalid_email:false,
			invalid_code:false,
			success_change:false,
			email_check:false,
			code_check:false,
			password_match:false,
			error:false
		};
	}
	changeHandler=(event)=>{
		let name=event.target.name;
		let val=event.target.value;
		this.setState({[name]:val})
	}
	set_state =(state_to_be_set,val)=>{
		this.setState({
			[state_to_be_set]:val
		})
	}

	send_code = (event) =>{
		event.preventDefault();

		const pointerToThis=this;
		let data={
			email:this.state.email
		}
		let body_data=JSON.stringify(data);

		let url="http://127.0.0.1:8080/forgotemail";
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
				console.log("An Error has occured with code"+response.status);
			}
			else{
				response.json().then(function(data){
					// console.log(data);
					if(data.key=='0060'){
						pointerToThis.set_state('invalid_email',true);
					}else
					if(data.key=='0070'){
						pointerToThis.set_state('invalid_email',false);
						pointerToThis.set_state('email_check',true);
					}
				})
			}
		})
		.catch(function(error){
		console.log("ERROR-"+error);
	})
	}

	code_verify=(event)=>{
		event.preventDefault();

		const pointerToThis=this;
		let data={
			code:this.state.code
		}
		let body_data=JSON.stringify(data);
		console.log(body_data);
		let url="http://127.0.0.1:8080/forgotcode";
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
				console.log("An Error has occured with code"+response.status);
			}
			else{
				response.json().then(function(data){
					// console.log(data);
					if(data.key=='0090'){
						pointerToThis.set_state('invalid_code',true);
					}else
					if(data.key=='0080'){
						pointerToThis.set_state('invalid_code',false);
						pointerToThis.set_state('code_check',true);
					}
				})
			}
		})
		.catch(function(error){
		console.log("ERROR-"+error);
	})
	}

	change_password=(event)=>{
		event.preventDefault();
		const {password,confirm_password}=this.state;
		const pointerToThis=this;
		if(password!=confirm_password){
			this.set_state('password_match',true)
			this.set_state('code_check',false)

		}else{
			let data={
			password:this.state.password
		}
		let body_data=JSON.stringify(data);
		console.log(body_data);
		let url="http://127.0.0.1:8080/forgotpassword";
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
				console.log("An Error has occured with code"+response.status);
			}
			else{
				response.json().then(function(data){
					// console.log(data);
					if(data.key=='0200'){
						pointerToThis.set_state('error',true);
					}else
					if(data.key=='0100'){
						pointerToThis.set_state('invalid_code',false);
						pointerToThis.set_state('success_change',true);
					}
				})
			}
		})
		.catch(function(error){
		console.log("ERROR-"+error);
	})
		}
	}

	render(){
		return(
				<div id="container-forgot">
				<Card >
				  <Card.Header as="h5">Forgot you password?</Card.Header>
				  <Card.Body id="card_body">				    
				    <Card.Text>
				    <Row>
				      	<Col>
				      	<Form.Group controlId="exampleForm.">
						    <Form.Label id='email_address'>Enter Registered Email Address</Form.Label>
						    <Form.Control type="email" placeholder="name@example.com" name='email' onChange={this.changeHandler} />
						 </Form.Group>
						 </Col>
				      	 <Col>
				      	 <Button variant="secondary" id='code-button' onClick={this.send_code}>Send Reset Code </Button>
						 </Col>

					</Row>
					   <Row>
				      	<Col>
				      	<Form.Group controlId="">
						    <Form.Label id='email_address'>Enter Code</Form.Label>
						    {this.state.email_check ?( 
						    	<Form.Control type="text" placeholder="Enter Code" name='code' onChange={this.changeHandler} />
						    ):(
						    <Form.Control type="text" placeholder="Enter Code"  disabled />

						    )
						    }
						 </Form.Group>
						 </Col>
				      	 <Col>
				      	 {this.state.email_check ?(
				      	 <Button variant="secondary" id='code-button' onClick={this.code_verify}>Verify Code</Button>):(
				      	 <Button variant="secondary" id='code-button' disabled>Verify Code</Button>

				      	 )
						    }
						 </Col>
					</Row>
					<Row>
				      	<Col>
				      	<Form.Group controlId="">
				      		{this.state.code_check ?(
						    	<Form.Control type="password" placeholder="Enter New Password" name='password' onChange={this.changeHandler} />
						    	):(
						   			 <Form.Control type="password" placeholder="Enter New Password"   disabled />
						    	)
				      		}
						 </Form.Group>
						 </Col>
				      	 <Col>
				      	 	{this.state.code_check ?(
						    	<Form.Control type="password" placeholder="Confirm Password" name='confirm_password' onChange={this.changeHandler}/>
				      		):(
						    	<Form.Control type="password" placeholder="Confirm Password"   disabled/>	
				      		)
				      		}
						 </Col>
					</Row>
				    </Card.Text>

				    {this.state.code_check ?(
				    	<Button variant="success" onClick={this.change_password}>Confirm </Button>				    	
				    	):(
				    	<Button variant="success" disabled>Confirm </Button>
				    	)
				    }
				  </Card.Body>
				 <Card.Footer className="text-muted">Not a member yet ? <a href="/signup">Join here</a></Card.Footer>
				</Card>
				{this.state.invalid_email &&
				 <Alert variant='warning'>
				 	This Email is not registered!!
				 </Alert>
				}
				{this.state.invalid_code &&
				 <Alert variant='danger'>
				 	This is an invalid code !!
				 </Alert>
				}	
				{this.state.code_check &&
				 <Alert variant='success'>
				 	Code is verified , please type in the new Password.
				 </Alert>
				}	
				{this.state.error &&
				 <Alert variant='warning'>
				 	Oops , Something unusual has happened , give it another go.
				 </Alert>
				}
				{this.state.password_match &&
				 <Alert variant='danger'>
				 	Passwords don't match.
				 </Alert>
				}
				{	this.state.success_change &&
							
							<Alert variant='success' id='success-signup'>
							  <h4><Alert.Heading>Password Changed Successfully!</Alert.Heading></h4>
								 <div id='success-gif'>
								 <img src={check} />
								 </div>
								 <span id='success-text'>
								<h5> You Can Sign In-><a href="/signin">here</a> With New Password </h5>
								 </span>
							</Alert>					
						}		
				</div>
			)
	}
}
export default ForgotPassword;
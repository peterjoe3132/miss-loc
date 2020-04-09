import React,{Component} from 'react'
import {Card,Nav,Button,Row,Form,Col} from 'react-bootstrap'
import './Dashboard.css'


class Dashboard extends Component{
	constructor(props){
		super(props);
			this.state={
				username: this.props.username ,
				user_id:this.props.userId,
				name:'',
				age: "",
				gender: "",
				address: "",
				image: "",
				description: "",
				successful_insertion: false      

			}
		}
	handleChange=(event)=>{
		const name=event.target.name;
		const val=event.target.value;
		this.setState({
			[name]:val
		})
	}

	uploadImage=(event)=>{
		const files=event.target.files;
		const myfile=files[0];
		console.log("file type"+myfile);
		const imageType=/image.*/
		if (!myfile.type.match(imageType)) {
	    alert('Sorry, only images are allowed')
	    return
	  }
	  else
	  if (myfile.size > (1000*1024)) {
	    alert('Sorry, the max allowed size for images is 1MB')
	    return
	  }
	  else
	  	this.set_state('image',myfile);
	  console.log("the file value is "+this.state.image)
	}
	
	set_state=(state_to_be_set,val)=>{
		this.setState({
			[state_to_be_set]:val
		});
	}

	handleSubmit=(event)=>{
		event.preventDefault();
		const formData=new FormData();
		formData.append('name',this.state.name);
		formData.append('age',this.state.age);
		formData.append('gender',this.state.gender);
		formData.append('description',this.state.description);
		formData.append('user_id',this.state.user_id);
		formData.append('image',this.state.image);
		formData.append('image_name',"multer-image"+Date.now())

	var pointerToThis=this;
	var url="http://127.0.0.1:8080/signin/newsearch"
	var request= {
		method:"POST",
		body:formData,
		headers: {
              "Access-Control-Allow-Origin":"*",
              'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept'
            }
	}
	fetch(url,request)
	.then(function(response){
		if(response.status!=200){
			console.log("An Error Has Occured with Code "+ response.status);
		}else{
			response.json().then(function(data){
				if(data.key=='0300'){
					pointerToThis.set_state('successful_insertion',true);					
				}
			})
			}
	})
	.catch(function(error){
		console.log("Error"+error);	
	})
	}
	render(){
		return(
			<div>
				<Card bg='secondary' text='white' id='dashboard-container'>
				  <Card.Header>
				    <Nav fill variant="tabs" defaultActiveKey="#new">
				      <Nav.Item>
				        <Nav.Link href="#new"> Search</Nav.Link>
				      </Nav.Item>
				   
				       <Nav.Item  className="justify-content-end" >
				        <Nav.Link disabled>  <span id='sign-in-as'>Signed in as {this.state.username}</span></Nav.Link>				      
				      </Nav.Item>
				       <Nav.Item  className="justify-content-end" >
				        <Nav.Link href='/'> Logout</Nav.Link>				      
				      </Nav.Item>				      
				    </Nav>
				  	</Card.Header>
				  <Card.Body id='form-container'>
				    <Card.Title>We will help you find your dear one, please fill the following</Card.Title>
					
					<Form id='form-container1'>

					  <Form.Row>
					    <Form.Group as={Col} controlId="formGridName">
					      <Form.Label>Name </Form.Label>
					      <Form.Control type="text" placeholder="Enter Name" name='name' onChange={this.handleChange}/>
					    </Form.Group>

					    <Form.Group as={Col} controlId="formGridAge">
					      <Form.Label>Age</Form.Label>
					      <Form.Control type="number" placeholder="Enter Age" name='age' onChange={this.handleChange} />
					    </Form.Group>

					    <Form.Group as={Col} controlId="formGridGender">
					      <Form.Label>Gender</Form.Label>
					       <Form.Control as="select" name='gender' onChange={this.handleChange}>
					       	<option>Choose..</option>
					        <option value='male'>Male</option>
					        <option value='female'>Female</option>
					      </Form.Control>
					    </Form.Group>
					  </Form.Row>

					  <Row>
					  
					  <Col>
					  <Form.Group controlId="formGridAddress1">
					    <Form.Label>Last Known Address</Form.Label>
					    <Form.Control type='text' placeholder="1234 Main St" name='address' onChange={this.handleChange}/>
					  </Form.Group>
					  </Col>
					  <Col>
					  <Form.Group controlId="formGridImage">
					    <Form.Label>Upload Image</Form.Label>
					    <Form.Control type='file' placeholder="Upload Image" name='image' onChange={this.uploadImage}  multiple/>
					  </Form.Group>
					  </Col>
					  </Row>
					<Row>
					<Col>
					</Col>
					<Col>
					  <Form.Group controlId="formGridDescription">
					    <Form.Label>Description</Form.Label>
					    <Form.Control as='textarea' placeholder="Please Enter Physical Description" name='description' onChange={this.handleChange}/>
					  </Form.Group>
					</Col>
					</Row>
					<br />
					  <Button variant="success" type="submit" id='search-button' onClick={this.handleSubmit}>
					    Search
					  </Button>
					</Form>				   
				  </Card.Body>
				  { this.state.successful_insertion &&

				  	alert(" Succesful Insertion")
				  }
				</Card>		
			</div>
			)
	}
}
export default Dashboard;
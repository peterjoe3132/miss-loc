	import React,{Component} from 'react'
	import {Card,Nav,Button,Row,Form,Col,Alert,Table} from 'react-bootstrap'
	import Modal from 'react-bootstrap/Modal'
	import Spinner from 'react-bootstrap/Spinner'
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
					loading_sign:false,
					search_found:false,
					show:false,
					result_images:[]
								   
				}
			}
		closeModal=(event)=>{
			this.set_state('show',false)
			this.cancelCourse();

		}
		cancelCourse = () => { 
		  this.myFormRef.reset();
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
		displayTable=()=>{
			// console.log(this.state.result_images)
		}
		set_state=(state_to_be_set,val)=>{
			this.setState({
				[state_to_be_set]:val
			});
		}

		handleSubmit=(event)=>{
			this.set_state('loading_sign',true)
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
							pointerToThis.set_state('show',true);	
							pointerToThis.set_state('loading_sign',false)

					}
					else 
						if(data.key=='0400'){
							pointerToThis.set_state('show',true);	
							pointerToThis.set_state('loading_sign',false)
							pointerToThis.set_state('result_images',data.image)
							// console.log("DATAA"+pointerToThis.state.result_images)

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
						
						<Form id='form-container1' ref={(el) => this.myFormRef = el}>

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
						  {this.state.loading_sign && 
						  <Button variant="success"  id='search-button' disabled>
							<Spinner
							      as="span"
							      animation="grow"
							      size="sm"
							      role="status"
							      aria-hidden="true"
							    />
							    Searching...	
							    <Spinner
							      as="span"
							      animation="border"
							      size="sm"
							      role="status"
							      aria-hidden="true"
							    />	
						  </Button>}
						  {!this.state.loading_sign &&
						  <Button variant="success" type="submit" id='search-button' onClick={this.handleSubmit}>
						   Search		
						  </Button>}
						</Form>				   
					  </Card.Body>
					 
					  	
					</Card>		

	 
		<Modal
		  show={this.state.show}
	      size="lg"
	      aria-labelledby="contained-modal-title-vcenter"
	      centered
	      className="SearchModal"
	      onHide={this.closeModal}
	    >
	      <Modal.Header closeButton>
	        <Modal.Title id="contained-modal-title-vcenter" >
	          Search Results 	
	        </Modal.Title>
	      </Modal.Header>
	      <Modal.Body>

	       
	        {this.state.search_found &&
	        	<div>
	        	
	        	  <Alert  variant={"danger"}>
					<h4>Sorry , We couldn't find any matches !  </h4>	 			
				   </Alert>
	 			   </div>
	        }
	        {!this.state.search_found &&

	        	<div>
	        	<Alert  variant={"success"}>
					<h6> Search Results for Name:<b>{this.state.name}</b>< </h6>	 			
				   </Alert>
	        	<Table striped bordered hover>
				  <thead>
				    <tr>
				      <th>#</th>
				      <th>Image Name</th>
				      <th>Image Date Time </th>
				      <th>GPS</th>
				    </tr>
				  </thead>
				  <tbody>
				  {this.state.result_images.map((img,i)=>{

				  	console.log("THIS IS the MAp for index"+JSON.stringify(i))
				  	return(
				  		<tr>
				  		<td>{i+1}</td>
				  		<td>{img.name}</td>
				  		<td>{img.datetime}</td>
				  		<td>{img.gps}</td>
				  		</tr>
				  		)
				  })}
				  </tbody>
				</Table>
				</div>

	        }
	        
	      </Modal.Body>
	      <Modal.Footer>
	        <Button onClick={this.closeModal}>Close</Button>
	      </Modal.Footer>
	    </Modal>
	    </div>
				)
		}
	}
	export default Dashboard;
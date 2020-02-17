import React,{Component} from 'react'

class ForgotPassword extends Component{
	constructor(props){
		super(props);
		this.state={
			email:'',
			code:''
		};
	}
	changeHanlder=(event)=>{
		let name=event.target.name;
		let val=event.target.value;
		this.setState({[name]:val})
	}

	render(){
		return(
				<div >
					<h1>This is password page</h1>
					<input
					type='email'
					name='email'
					placeholder='Enter Registered Email'
					/>


				</div>
			)
	}
}
export default ForgotPassword;
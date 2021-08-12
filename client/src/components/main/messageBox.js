import React, {Component} from 'react';
import  imgUrl from '../images/unnamed.jpg'
import Messages from './messages.js';

class MessageBox extends Component{
	state = {
		messageValue : '',
		messages : []
	}

	componentDidUpMount = () => {
		console.log("featch on update");
	}

	handleSendMsg = (e) => {
		e.preventDefault();
		this.setState({
			messageValue : '',
			messages: [...this.state.messages,{message:this.state.messageValue,sender:this.props.user,status:"time"}]
		})
	}
	handleStatusChange = (id,to) => {
		let newArr = [...this.state.messages];
		newArr[id].status = to;
		this.setState({
			messages:newArr
		})
	}
	handleChange = (event) => {
		this.setState({
			messageValue: event.target.value
		})
	}

	render(){
		return(
		<div className="message-box">
			<div className="message-box-nav">
				<img alt="profpic" className="profile-pic-small" src={imgUrl} />
				<h1 className="sender-name">{this.props.active.name}</h1>
			</div>
			<Messages user={this.props.user} messages = {this.state.messages} />
			<form onSubmit={this.handleSendMsg} className="message-form">
				<input onChange={this.handleChange} value={this.state.messageValue} placeholder="type a message"/>
				<button>send</button>
			</form>
		</div>
		);
	}
}

export default MessageBox;
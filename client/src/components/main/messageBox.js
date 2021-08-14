import React, {Component} from 'react';
import  imgUrl from '../images/unnamed.jpg'
import Messages from './messages.js';
import {GrSend} from 'react-icons/gr';
import axios from 'axios';

class MessageBox extends Component{
	state = {
		messageValue : '',
		messages : [],
		dataCount: 2,
		maxPage:1,
	}

	gotoBottom = () => {
		try{
			const messages = document.querySelector(".messages");
			messages.scrollTop = messages.scrollHeight;
		}catch(err){
		}
	}

async componentDidUpdate(prevProp){
	if(prevProp.active !== this.props.active){
		const messages = await axios.get(`http://127.0.0.1:5500/api/messages/${this.props.active._id}/1`,{
          headers:{
            "auth-token": this.props.user.token
          }
      });
      this.setState({messages:messages.data.msg,maxPage:messages.data.pages})
      this.gotoBottom();
    }
}
	

	prependMessages = async(callback) => {
		if(this.state.dataCount > this.state.maxPage){
		}else{
	const messages = await axios.get(`http://127.0.0.1:5500/api/messages/${this.props.active._id}/${this.state.dataCount}`,{
          headers:{
            "auth-token": this.props.user.token
          }
      });

   		// console.log(messages.data.msg.concat(this.state.messages));
		const newArr =	messages.data.msg.concat(this.state.messages); 
    this.setState({
    	messages:newArr,
    	dataCount : this.state.dataCount + 1
    })
    callback();
  }
	}


	handleSendMsg = async(e) => {
		e.preventDefault();
		const message = await axios.patch("http://127.0.0.1:5500/api/messages/send",
        {"content":this.state.messageValue,"recieverId":this.props.active._id}
      ,{
          headers:{
            "auth-token": this.props.user.token
          }
      }) 
		this.setState({
			messageValue : '',
			messages:[...this.state.messages,message.data],
		})
		this.gotoBottom();
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

		if(this.props.active._id){
		return(
		<div className="message-box">
			<div className="message-box-nav">
				<img alt="profpic" className="profile-pic-small" src={imgUrl} />
				<h1 className="sender-name">{this.props.active.username}</h1>
			</div>
			<Messages prependMessages={this.prependMessages} user={this.props.user} messages = {this.state.messages} />
			<form onSubmit={this.handleSendMsg} className="message-form">
				<input onChange={this.handleChange} value={this.state.messageValue} placeholder="type a message"/>
				<button className="msg-send-btn"><GrSend /></button>
			</form>
		</div>
		);		
	}else{
		return (
			<div className="message-box">
				<h1>message-box</h1>
			</div>
			);
	}

	}
}

export default MessageBox;
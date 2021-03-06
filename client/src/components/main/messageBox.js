import React, { Component } from 'react';
import imgUrl from '../images/unnamed.jpg';
import backImg from '../images/chat.svg';
import Messages from './messages.js';
import { GrSend } from 'react-icons/gr';
import axios from 'axios';

class MessageBox extends Component {
	state = {
		online: false,
		messageValue: '',
		messages: [],
		dataCount: 2,
		maxPage: 1,
	}
	gotoBottom = () => {
		try {
			const messages = document.querySelector(".messages");
			messages.scrollTop = messages.scrollHeight;
		} catch (err) {
		}
	}
	
	recieveAck = () => {
		
		let msgs = [...this.state.messages];

		for(let i=0;i<msgs.length;i++){

			if(msgs[msgs.length - (i + 1)].status === "seen"){
				break;
			}else{
				if(msgs[msgs.length - (i + 1)].senderId === this.props.user._id){
					msgs[msgs.length - (i + 1)].status = "seen";
				}
			}
		}
		
		this.setState({
			messages : msgs,
		})
	}

	async componentDidUpdate(prevProp, prevState) {
		this.props.socket.off('onlineStatus').on('onlineStatus', (status, userId) => {
			
			if (this.props.active.userId === userId) {
				this.setState({
					online: status
				})
			}
		})

		if (prevState.messages !== this.state.messages) {
			this.props.socket.off('recieve').on('recieve', async (msg,chatId) => {
					
				this.props.handleSetFirst(chatId,msg);

				if (msg.senderId === this.props.active.userId) {

					this.setState({
						messages: [...this.state.messages, msg],
					});
					this.gotoBottom();
					if(this.state.online){
						this.props.socket.emit('sendAck', this.props.active.userId,this.props.user._id);
					}				
				}

			})
			
			this.props.socket.off('recieveAck').on('recieveAck', async (userId) => {
				if(userId === this.props.active.userId){
					this.recieveAck();
				}
					this.props.contactLastMsgSeen(userId);
			})


		}
		
		if (prevProp.active !== this.props.active) {
			const messages = await axios.get(`http://127.0.0.1:5500/api/messages/${this.props.active.chatId}/1`, {
				headers: {
					"auth-token": this.props.user.token
				}
			});
		
			this.setState({
				messages: messages.data.msgs,
				maxPage: messages.data.pages,
				online: messages.data.online
			})
			this.gotoBottom();
			
			if(this.state.online){
				this.props.socket.emit('sendAck', this.props.active.userId,this.props.user._id);
			}
		}
	}

	prependMessages = async (callback) => {

		if (this.state.dataCount <= this.state.maxPage) {
			const messages = await axios.get(`http://127.0.0.1:5500/api/messages/${this.props.active.chatId}/${this.state.dataCount}`, {
				headers: {
					"auth-token": this.props.user.token
				}
			});
			let unseenMsgs = messages.data.msgs.filter(msg => msg.status !== "seen" && msg.senderId === this.props.active._id);
			unseenMsgs.map(
				async msg => {
					this.props.socket.emit('sendAck', msg)
					await axios.patch("http://127.0.0.1:5500/api/messages/messageSeen",
						{ _id: msg.ref, userId: this.props.active._id },
						{ headers: { "auth-token": this.props.user.token } }
					)
					await axios.patch("http://127.0.0.1:5500/api/messages/messageSeen",
						{ _id: msg._id, userId: this.props.user._id },
						{ headers: { "auth-token": this.props.user.token } }
					)
				})

			this.setState({
				messages: messages.data.msgs.concat(this.state.messages),
				dataCount: this.state.dataCount + 1
			})
			callback();
		}
	}



	handleSendMsg = async (e) => {
		e.preventDefault();
		if(this.state.messageValue !== ""){
		const message = await axios.patch("http://127.0.0.1:5500/api/messages/send",
			{ "content": this.state.messageValue, "chatId": this.props.active.chatId }
			, {
				headers: {
					"auth-token": this.props.user.token
				}
			})
		this.props.handleSetFirst(this.props.active.chatId,message.data.senderMsg);
		this.setState({
			messageValue: '',
			messages: [...this.state.messages, message.data.senderMsg],
		})
		this.gotoBottom();
		if(this.state.online){
			this.props.socket.emit('send', this.props.active,message.data.senderMsg);
		}
	}
}

	handleChange = (event) => {
		this.setState({
			messageValue: event.target.value
		})
	}

	render() {
		if (this.props.active.chatId) {
			return (
				<div className="message-box">
					<div className="message-box-nav">
						<img alt="profpic" className="profile-pic-small" src={imgUrl} />
						<div className="sender-name">
							<h1>{this.props.active.username}</h1>
							<p className="chat-status">{this.state.online ? "online" : ""}</p>
						</div>

					</div>
					<Messages socket={this.props.socket} prependMessages={this.prependMessages} user={this.props.user} messages={this.state.messages} />
					<form onSubmit={this.handleSendMsg} className="message-form">
						<input onChange={this.handleChange} value={this.state.messageValue} placeholder="type a message" />
						<button className="msg-send-btn"><GrSend /></button>
					</form>
				</div>
			);
		} else {
			return (
				<div className="message-box">
					<div className="made-simple">
						<h1>Simple, Reliable Messaging</h1>
						<p>Message your friends and family for free</p>
					</div>
					<img alt="profpic" className="backImg" src={backImg} />
				</div>
			);
		}

	}
}

export default MessageBox;
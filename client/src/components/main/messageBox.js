import React, { Component } from 'react';
import imgUrl from '../images/unnamed.jpg'
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

	async componentDidUpdate(prevProp, prevState) {
		this.props.socket.off('onlineStatus').on('onlineStatus', (status, userId) => {
			
			if (this.props.active.userId === userId) {
				this.setState({
					online: status
				})
			}
		})
		if (prevState.messages !== this.state.messages) {
			this.props.socket.off('recieve').on('recieve', async (msg) => {
				
				if (msg.senderId === this.props.active.userId) {
					// this.props.socket.emit('sendAck', msg)
					this.setState({
						messages: [...this.state.messages, msg],
					})
					this.gotoBottom();
					// await axios.patch("http://127.0.0.1:5500/api/messages/messageSeen",
					// 	{ userId: msg.senderId, _id: msg._id }
					// 	, {
					// 		headers: {
					// 			"auth-token": this.props.user.token
					// 		}
					// 	})

				}
			})
		}

		if (prevProp.active !== this.props.active) {
			const messages = await axios.get(`http://127.0.0.1:5500/api/messages/${this.props.active.chatId}/1`, {
				headers: {
					"auth-token": this.props.user.token
				}
			});
			console.log(messages);
			this.setState({
				messages: messages.data.msgs,
				maxPage: messages.data.pages,
				online: messages.data.online
			})
			this.gotoBottom();
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
		const message = await axios.patch("http://127.0.0.1:5500/api/messages/send",
			{ "content": this.state.messageValue, "chatId": this.props.active.chatId }
			, {
				headers: {
					"auth-token": this.props.user.token
				}
			})
		this.props.handleSetFirst(message.data.senderMsg);
		this.setState({
			messageValue: '',
			messages: [...this.state.messages, message.data.senderMsg],
		})
		this.gotoBottom();
		if(this.state.online){
			this.props.socket.emit('send', this.props.active,message.data.senderMsg);
		}
				// this.props.socket.off('recieveAck').on('recieveAck', msgRef => {

		// 	let index = this.state.messages.findIndex(x => x._id === msgRef)
		// 	const msg = this.state.messages[index]
		// 	msg.status = "seen";
		// 	this.setState({
		// 		messages: [
		// 			...this.state.messages.slice(0, index),
		// 			msg,
		// 			...this.state.messages.slice(index + 1)
		// 		]
		// 	})
		// 	axios.patch("http://127.0.0.1:5500/api/messages/messageSeen",
		// 		{ _id: msg._id, userId: this.props.user._id },
		// 		{ headers: { "auth-token": this.props.user.token } }
		// 	)
		// });
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
					<h1>message-box</h1>
				</div>
			);
		}

	}
}

export default MessageBox;
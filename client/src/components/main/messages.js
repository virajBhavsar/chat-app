import React, { Component } from 'react';
import StatusIcon from './statusIcon.js';

class Messages extends Component {

	onScroll = () => {
		const messages = document.querySelector(".messages");
		const prevHeight = messages.scrollHeight;
		if (messages.scrollTop === 0) {
			this.props.prependMessages(() => {
				messages.scrollTop = messages.scrollHeight - prevHeight;
			});
		}
	}
	render() {
		return (
			<div onScroll={this.onScroll} className="messages">
				<ul>
					{this.props.messages.map(message => {
						let date = new Date(message.date);
						if(message.type === "greet"){
							return (
									<li key={message._id} className="greet-message">
										<div className="only-message message">{message.content}</div>
									</li>
								)
						}else{
							if (message.senderId === this.props.user._id) {
								return (
									<li key={message._id} className="message right-message">
										<div className="only-message">{message.content}</div>
										<p className="msg-time">{date.toLocaleString('en-US', { hour: 'numeric',minute:"numeric", hour12: true })}</p>
										<StatusIcon status={message.status} />
									</li>
								)
							} else {
								return (
									<li key={message._id} className="message left-message">
										<div className="only-message">
											{message.content}
										</div>
										<p className="msg-time">{date.toLocaleString('en-US', { hour: 'numeric',minute:"numeric", hour12: true })}</p>
									</li>
								)
							}	
						}
						
					})}
				</ul>
			</div>
		);
	}
}

export default Messages;

import React, {Component} from 'react';
import StatusIcon from './statusIcon.js';

class Messages extends Component{

	onScroll = () => {
  	const messages = document.querySelector(".messages");
  	const prevHeight = messages.scrollHeight;
  	if(messages.scrollTop === 0){
  		this.props.prependMessages(()=>{
  			messages.scrollTop = messages.scrollHeight - prevHeight;
  		});
		}}
render(){
		return(
			<div onScroll={this.onScroll} className="messages">
				<ul>
					{this.props.messages.map(message => {
					 if(message.senderId === this.props.user._id){
					 	return(
					 	<li key={message._id} className="message right-message">
					 		<div className="only-message">{message.content}</div>
					 		<p className="msg-time">{message.date.slice(11,16)}</p>
							<StatusIcon status={message.status} />
					 	</li>
						)}else{
					 		return(
					 		<li key={message._id} className="message left-message">
					 			<div className="only-message">
					 				{message.content}
					 			</div>
					 			<p className="msg-time">{message.date.slice(11,16)}</p>
					 		</li>
					 		)
					 	}
				})}
				</ul>
			</div>
		);
	}
	}

export default Messages;

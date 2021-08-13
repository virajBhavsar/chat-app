import React, {Component} from 'react';
import StatusIcon from './statusIcon.js';

class Messages extends Component{
  componentDidUpdate() {
  	const messages = document.querySelector(".messages");
   messages.scrollTop = messages.scrollHeight;
	}

render(){
		return(
			<div className="messages">
				<ul>
					{this.props.messages.map(message => {
					 if(message.sender === this.props.user){
					 	return(
					 	<li key={message.id} className="message right-message">
					 		<div className="only-message">{message.message}</div>
							<StatusIcon status={message.status} />
					 	</li>
						)}else{
					 		return(
					 		<li className="message left-message">{message.message}</li>
					 		)
					 	}
					 
				})}

				
				</ul>
			</div>
		);
	}
	}

export default Messages;

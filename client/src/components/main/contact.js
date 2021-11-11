import React, {Component} from 'react';
import imgUrl from '../images/unnamed.jpg'
import StatusIcon from './statusIcon.js';

class Contact extends Component{
	
	stickerVisible = () =>{
		if(this.props.contact.unseen === 0){
			return "unseen-sticker invisible";
		}else{
			return "unseen-sticker";
		}
	}
	getStatusIcon = () => {
		if(this.props.contact.lastMsg.senderId === this.props.user._id){
			return <StatusIcon status={this.props.contact.lastMsg.status} />;
		}else{
			return <StatusIcon status={"invisible"}></StatusIcon>;
		}
	}

	getLeftPadding = () => {
		if(this.props.contact.lastMsg.senderId === this.props.user._id){
			return 'last-msg-content padding1';
		}else{
			return 'last-msg-content';
		}

	}

	render(){
		let date = new Date(this.props.contact.lastMsg.date);
		return(
		<div className={this.props.className}>
			<img alt="profpic" className="profile-pic-small" src={imgUrl} />
			<div onClick={this.props.setActive} className="contact-data">
				<h1 className="contact-name">{this.props.contact.username}</h1>
				<div className="last-msg">
					<div className="last-msg-data">
						{this.getStatusIcon()}
						<span className={this.getLeftPadding()}>{this.props.contact.lastMsg.content}</span>
					</div>
					<p className="lastmsg-time">{date.toLocaleString('en-US', { hour: 'numeric',minute:"numeric", hour12: true })}</p>
				</div>
				<div className={this.stickerVisible()}>{this.props.contact.unseen}</div>
			</div>
		</div>		
		);
	}
}

export default Contact;
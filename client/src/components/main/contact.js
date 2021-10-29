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
	getStatucIcon = () => {
		if(this.props.contact.lastMsg.senderId === this.props.user._id){
			return <StatusIcon status={this.props.contact.lastMsg.status} />;
		}else{
			return '';
		}
	}

	render(){
		let date = new Date(this.props.contact.lastMsg.date);
		return(
		<div className={this.props.className}>
			<img alt="profpic" className="profile-pic-small" src={imgUrl} />
			<div onClick={this.props.setActive} className="contact-data">
				<h1 className="contact-name">{this.props.contact.username}</h1>
				<div className="last-msg">{this.getStatucIcon()}<p>{this.props.contact.lastMsg.content}</p></div>
				<p className="lastmsg-time">{date.toLocaleString('en-US', { hour: 'numeric',minute:"numeric", hour12: true })}</p>
				<p className={this.stickerVisible()}>{this.props.contact.unseen}</p>
			</div>
		</div>		
		);
	}
}

export default Contact;
import React, {Component} from 'react';
import imgUrl from './images/unnamed.jpg'

class Contact extends Component{
	
	render(){
		return(
		<div className={this.props.className}>
			<img alt="profpic" className="profile-pic-small" src={imgUrl} />
			<div onClick={this.props.setActive} className="contact-data">
				<h1 className="contact-name">{this.props.contact.name}</h1>
				<p className="last-msg">{this.props.lastmsg}</p>
			</div>
		</div>		
		);
	}
}

export default Contact;
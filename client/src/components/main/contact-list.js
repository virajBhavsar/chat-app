import React, { Component } from 'react';
import Contact from './contact'

class ContactList extends Component {

	render() {
		return (

			<div className="contacts">
				{this.props.contacts.map((contact, index) => (
					<Contact 
						user={this.props.user} 
						setActive={() => this.props.handleSetActive(contact, index)}
						className={this.props.active.email === contact.email ? "one-contact active-contact" : "one-contact"} 
						key={contact.chatId} 
						contact={contact} />
				)
				)}
			</div>

		);
	}
}

export default ContactList;
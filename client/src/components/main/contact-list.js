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
						className={this.props.active.chatId !== contact.chatId ? "one-contact" : "one-contact active-contact"} 
						key={contact.chatId} 
						contact={contact} />
				)
				)}
			</div>

		);
	}
}

export default ContactList;
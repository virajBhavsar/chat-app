import React, {Component} from 'react';
import Contact from './contact'

class ContactList extends Component{
	
	render(){
		return(

		<div className="contacts">
		{this.props.contacts.map(contact => (
			<Contact lastmsg={this.props.lastmsg} setActive={() => this.props.handleSetActive(contact)} className={this.props.active.number === contact.number ? "one-contact active-contact" : "one-contact"} key={contact._id} contact={contact}/>
			)	
		)}
		</div>
		
		);
	}
}

export default ContactList;
import React, { Component } from 'react';
import ContactList from './contact-list';
import Messages from './messageBox';
import AccountNav from './accountNav'
import axios from 'axios';

class Main extends Component {
  state = {
    active: {},
    contacts: []
  }

  componentDidMount = async() => {
    const contacts = await axios.get("http://127.0.0.1:5500/api/messages/contacts",{
        headers:{
          "auth-token": this.props.user.token
        }
      }) 

    this.setState({
      contacts : contacts.data
    })
     }

     

  handleSetActive = (contact) => {
    this.setState({
      active: contact
    })
  }
  handleAddContact = async(email) => {
      console.log(email);
      const contact = await axios.patch("http://127.0.0.1:5500/api/messages/addcontact",
        {"email": email}
      ,{
          headers:{
            "auth-token": this.props.user.token
          }
      }) 
      this.handleSetActive(contact.data);
      if(contact.data.error){
        this.props.popup(contact.data.error,false);
      }else{
        this.props.popup('contact added successfully',true);
        this.setState({
        contacts: [contact.data,...this.state.contacts]
      })
    }
    }
  render() {
    return (
        <div className="main">
                <AccountNav handleAddContact={this.handleAddContact} rollbackAuth={this.props.rollbackAuth} />
                <ContactList active={this.state.active} contacts={this.state.contacts} handleSetActive={this.handleSetActive} />
                <Messages user={this.props.user} active={this.state.active} />
        </div>
    )
  }
}

export default Main;

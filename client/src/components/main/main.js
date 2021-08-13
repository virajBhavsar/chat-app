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

     handleAddContact = async(email) => {
      console.log(email);
      const contact = await axios.patch("http://127.0.0.1:5500/api/messages/addcontact",
        {"email": email}
      ,{
          headers:{
            "auth-token": this.props.user.token
          }
      }) 
      console.log("this")
      if(contact.data.error){
        console.log(contact.data.error)
        this.props.popup(contact.data.error,false);
      }else{
        this.props.popup('contact added successfully',true);
        console.log(contact);
        this.setState({
        contacts: [contact.data,...this.state.contacts]
      })
    }
    }

  handleSetActive = (contact) => {
    this.setState({
      active: contact
    })
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

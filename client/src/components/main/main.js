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
    
    this.props.socket.emit('goOnline',this.props.user);
    const contacts = await axios.get("http://127.0.0.1:5500/api/messages/contacts",{
        headers:{
          "auth-token": this.props.user.token
        }
      }) 
    this.setState({
      contacts : contacts.data
    })
     }

     
  handleSetFirst = (lastMsg) => {
    let cons = [...this.state.contacts];
    let index = 0;

    for(let i=0;i<cons.length;i++){
      if(cons[i].chatId === this.state.active.chatId){
        index = i;
      
        let removed = cons.splice(index,1);
        removed[0].lastMsg = lastMsg;

        cons.splice(0,0,removed[0]);
        this.setState({
          contacts : cons
        })
      break;
      }
    }
  }

  handleSetActive = (contact,index) => {
    let cons = [...this.state.contacts];
    if(cons.length > 0){
      cons[index].unseen = 0; 
    }
    this.setState({
      active: contact,
      contacts : cons
    })
  }
  
  handleAddContact = async(email) => {
      const contact = await axios.patch("http://127.0.0.1:5500/api/messages/addcontact",
        {"email": email}
      ,{
          headers:{
            "auth-token": this.props.user.token
          }
      }) 
      if(contact.data.error){
        this.props.popup(contact.data.error,false);
      }else{
        this.handleSetActive(contact.data);
        this.props.popup('contact added successfully',true);
        this.setState({
        contacts: [contact.data,...this.state.contacts]
      })
    }
    }

  render() {
    return (
        <div className="main">
                <AccountNav 
                  user={this.props.user} 
                  socket={this.props.socket} 
                  handleAddContact={this.handleAddContact} 
                  rollbackAuth={this.props.rollbackAuth} 
                  />
                
                <ContactList 
                  user={this.props.user} 
                  active={this.state.active} 
                  contacts={this.state.contacts} 
                  handleSetActive={this.handleSetActive} 
                  />
                
                <Messages 
                  handleSetFirst={this.handleSetFirst} 
                  user={this.props.user} 
                  active={this.state.active} 
                  socket={this.props.socket}
                  />
        </div>
    )
  }
}

export default Main;

import React, { Component } from 'react';
import ContactList from './contact-list';
import Messages from './messageBox';
import AccountNav from './accountNav'

class Main extends Component {
  state = {
    active: { name: "viraj", email: "viraj@1.com" },
    contacts: [
      { name: "viraj", email: "viraj@1.com" },
      { name: "xyz", email: "xyz@1.com" }
    ]
  }

  handleSetActive = (contact) => {
    this.setState({
      active: contact
    })
  }
  render() {
    return (
        <div className="main">
                <AccountNav rollbackAuth={this.props.rollbackAuth} />
                <ContactList active={this.state.active} contacts={this.state.contacts} handleSetActive={this.handleSetActive} />
                <Messages user={this.props.user} active={this.state.active} />
        </div>
    )
  }
}

export default Main;

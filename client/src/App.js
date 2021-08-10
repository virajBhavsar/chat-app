import React, {Component} from 'react';
import './App.css';
import ContactList from './components/contact-list'
import Messages from './components/messageBox'

class App extends Component {
  state = {
    user: {name:"viraj",number:"9512948398"},
    active:{name:"viraj",number:"9512473894"},
    contacts : [
      {name:"viraj",number:"9512473894"},
      {name:"xyz",number:"9512473855"}
    ]
  }
  handleSetActive = (contact) => {
    this.setState({
      active:contact
    }) 
  }

  render(){
  return (
    <div className="App">
      <ContactList active={this.state.active} contacts={this.state.contacts} handleSetActive={this.handleSetActive} />
      <Messages user={this.state.user} active={this.state.active} />
    </div>
  )
}
}

export default App;

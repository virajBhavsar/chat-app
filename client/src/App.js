import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from './components/auth/login';
import Register from './components/auth/register';
import Main from './components/main/main';
import Logout from './components/auth/logout';

class App extends Component {
  state = JSON.parse(window.localStorage.getItem('state')) || {
    // state={
    user: {},
    privatePageAccess:false,
    popup:{visible:false,success:true,message:''}
  }

  popup = (msg,succ) => {
    this.setState({
      popup:{visible:true,success:succ,message:msg}
    })

    setTimeout(()=>{
      this.setState({
        popup:{visible:false,success:false,message:''}
      })
    },5000)
  }
  
	authenticateUser = async(user) =>{
		this.setState({
			user:{username:user.username,email:user.email,token:user.token},
      privatePageAccess : true
		},()=>{
    window.localStorage.setItem('state', JSON.stringify(this.state));
      
    });
	}

  rollbackAuth = () =>{
    this.setState({
      user:{},
      privatePageAccess : false
    },()=>{
    console.log(this.state)
    window.localStorage.setItem('state', JSON.stringify(this.state));
    });
    
  }
  render() {
    return (
      <Router>

        <div className="App">
          <div className={this.state.popup.visible ? "pop-up visible" : "pop-up"} >
            <span className={this.state.popup.success ? "green" : "red"}></span>
            <p>{this.state.popup.message}</p>
          </div>
          <Switch>
            <Route path="/main">
              {()=>{
                if(this.state.privatePageAccess){
                  return <Main popup={this.popup} rollbackAuth={this.rollbackAuth} user={this.state.user}/>                       
                }else{
                  return <Redirect to="/" />
                }
              }
              }
            </Route>
            <Route path="/register">
              <Register popup={this.popup} privatePageAccess={this.state.privatePageAccess}/>
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/">
              <Login popup={this.popup} privatePageAccess={this.state.privatePageAccess} authenticateUser={this.authenticateUser} />
            </Route>
          </Switch>

        </div>
      </Router>
    )
  }
}

export default App;

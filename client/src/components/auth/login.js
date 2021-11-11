import axios from 'axios';
import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";

function Login (props) {
		const [email,setEmail] = useState('');
		const [password,setPassword] = useState('');
		const [error,setError] = useState('');

		const handleEmailChange = (event) => {
			setEmail(event.target.value);
		}
		const handlePasswordChange = (event) => {
			setPassword(event.target.value);
		}
		const handleSubmit = async(event) => {
			event.preventDefault();
			const user = await axios.post('http://127.0.0.1:5500/api/auth/login',{
				email: email,
				password:password
			})
			if(user.data.type){
				setError(user.data.error);			
			}else{
				props.authenticateUser(user.data);
				props.popup('login successfully',true)
			}
		}
		const Errors = () =>{
			return <p className="error-red">{error}</p>
		}
		if(props.privatePageAccess){
			return <Redirect to="/main"></Redirect>
		}else{	
		return (
			<div className="login">
				<form className="auth-form" method="POST" onSubmit={handleSubmit}>
				<h1>login</h1>
				<div className="input-box">
					<input onChange={handleEmailChange} value={email} type="text" autoComplete="off" name="email" required />
					<label className="label">
						<span className="span">email</span>
					</label>
				</div>
				<div className="input-box">
					<input onChange={handlePasswordChange} value={password} type="password" autoComplete="off" name="password" required />
					<label className="label">
						<span className="span">password</span>
					</label>
				</div>
					<input id="submit" type="submit"/>
		</form>
			<Errors />
			
			<p className="other-link">
				don't have account 
				<Link to='/register'> register</Link>
			</p>

			</div>
		);
	}
	}
	


export default Login;
import React,{useState} from 'react';
import { Link } from "react-router-dom";
import {BsPower} from "react-icons/bs";
import {AiOutlinePlus} from "react-icons/ai";
function AccountNav (props) {
		const [showForm,setShowForm] = useState(false);
		const [email,setEmail] = useState('');

		const handleEmailChange = (event) => {
			setEmail(event.target.value);
		}
		const handleAddContact = (event) =>{
			event.preventDefault();
			props.handleAddContact(email)
		}
		const rollbackAuth = () => {
			props.rollbackAuth();
		}
		return (
			<div className="account-nav">
				<button onClick={()=>setShowForm(true)}><AiOutlinePlus /></button>
				<form onSubmit={handleAddContact}>
					<input placeholder="enter an email address" onChange={handleEmailChange} value={email} />
					<button type="submit"><AiOutlinePlus /></button>
				</form>
				<Link className="logout-btn" to="/logout" onClick={rollbackAuth}><BsPower /></Link>
			</div>
		);
	
	}
	


export default AccountNav;
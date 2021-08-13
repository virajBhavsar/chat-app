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
			props.handleAddContact(email);
			setShowForm(false);
		}
		const rollbackAuth = () => {
			props.rollbackAuth();
		}
		return (
			<div className="account-nav">
				<Link className={showForm ? "invisible" : "logout-btn visible"} to="/logout" onClick={rollbackAuth}><BsPower /></Link>
				<button className={showForm ? "invisible" : "add-contact-btn visible"} onClick={()=>setShowForm(true)}><AiOutlinePlus /></button>
				<form className={showForm ? "contact-form visible" : "invisible"} onSubmit={handleAddContact}>
					<input placeholder="enter an email address" onChange={handleEmailChange} value={email} />
					<button className="add-contact-btn" type="submit"><AiOutlinePlus /></button>
				</form>
			</div>
		);
	
	}
	


export default AccountNav;
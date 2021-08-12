import React from 'react';
import { Link } from "react-router-dom";

function AccountNav (props) {
		const rollbackAuth = () => {
			props.rollbackAuth();
		}
		return (
			<div className="account-nav">
				<Link to="/logout" onClick={rollbackAuth}>logout</Link>
			</div>
		);
	
	}
	


export default AccountNav;
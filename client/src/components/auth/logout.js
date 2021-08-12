import React from 'react';
import { Link } from "react-router-dom";

function Logout (props) {
		
		return (
			<div className="logout">
				<p>log in again<Link to="/">login</Link></p>
			</div>
		);
	
	}
	


export default Logout;
import React, {Component} from 'react';

import { FcCheckmark } from "react-icons/fc";
import { BiCheckDouble } from "react-icons/bi";
import { BsClockHistory } from "react-icons/bs";


class StatusIcon extends Component{

render(){
						if(this.props.status === "seen"){
							return(
								<div className="msg-status-icon icon14">
									<BiCheckDouble />
								</div>
								)
						}else if(this.props.status === "sent"){
							return(
							<div className="msg-status-icon icon14">
								<FcCheckmark />
							</div>
							)					
						}else{
						return(
							<div className="msg-status-icon">
								<BsClockHistory />
							</div>
							)
}}}									


export default StatusIcon;

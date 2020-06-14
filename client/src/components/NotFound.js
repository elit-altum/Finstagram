import React from "react";
import { FaRegSadTear as SadIcon } from "react-icons/fa";

const NotFound = ({ message }) => {
	return (
		<div className="not-found-container">
			<div className="not-found__icon">
				<SadIcon />
			</div>
			<h2 className="not-found__message">{message}</h2>
		</div>
	);
};

export default NotFound;

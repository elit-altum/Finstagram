import React, { useState } from "react";
import axios from "axios";
import { FaRegSadTear as SadIcon } from "react-icons/fa";

import { history } from "../router/router";

const UserCard = ({ user }) => {
	return (
		<div
			className="discover__userCard"
			onClick={() => history.push(`/user/${user.username}`)}
		>
			<img src={user.photo} alt="User profile" />
			<h3>{user.username}</h3>
			<p>{user.name}</p>
		</div>
	);
};

const NotFound = ({ message }) => {
	const [randomUsers, setRandomUsers] = useState([]);
	const fetchRandomUsers = async () => {
		try {
			const url = "/api/v1/users/random";
			const res = await axios({
				url,
				method: "GET",
			});
			setRandomUsers(res.data.data.users);
		} catch (err) {}
	};

	return (
		<div className="not-found-container">
			<div className="not-found__icon">
				<SadIcon />
			</div>
			<h2 className="not-found__message">{message}</h2>
			<button className="discover__button" onClick={fetchRandomUsers}>
				Find People
			</button>
			{!!randomUsers.length && (
				<div className="discover__users">
					{randomUsers.map((user) => (
						<UserCard user={user} key={user.id} />
					))}
				</div>
			)}
		</div>
	);
};

export default NotFound;

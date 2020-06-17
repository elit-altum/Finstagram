import React, { useState } from "react";
import axios from "axios";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { FcSearch as SearchIcon } from "react-icons/fc";
import { FaRegSadTear as SadIcon } from "react-icons/fa";

import { UserInfoSmall } from "./likesArray";

const SearchUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [text, setText] = useState("");

	const asyncFunction = async (value) => {
		try {
			const url = "/api/v1/users/search";
			const res = await axios({
				url,
				method: "POST",
				data: {
					search: value,
				},
			});
			setUsers(res.data.data.users);
			setLoading(false);
		} catch (err) {
			if (err.response.status === 400) {
				setUsers(["1"]);
			} else {
				setUsers([]);
			}
			setLoading(false);
		}
	};

	const asyncFunctionDebounced = AwesomeDebouncePromise(asyncFunction, 800);

	const handleTextChange = async (e) => {
		e.preventDefault();

		setLoading(true);
		setUsers(["1"]);
		setText(e.target.value);
		await asyncFunctionDebounced(e.target.value);
	};

	return (
		<div className="searchUsers">
			<h3>Search Users</h3>
			<div className="searchUser-bar">
				<div className="searchUser-bar__icon">
					<SearchIcon />
				</div>
				<input
					name="search"
					onChange={handleTextChange}
					autoComplete="off"
					className="searchUser-bar__input"
					placeholder="Search Users"
				/>
			</div>
			<div className="searchUsers-results">
				{!!text &&
					(!!users.length ? (
						!loading ? (
							users.map((user) => <UserInfoSmall user={user} key={user._id} />)
						) : (
							<div className="search-loader"></div>
						)
					) : (
						<div className="search-not-found">
							<SadIcon />
							<p>No users found.</p>
						</div>
					))}
			</div>
		</div>
	);
};

export default SearchUsers;

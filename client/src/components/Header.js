import React from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

import { history } from "../router/router";

import { toast } from "react-toastify";

const logout = async () => {
	const url = "/api/v1/users/logout";
	try {
		await axios({
			url,
			method: "GET",
		});
		toast.success("Logged out successfully!", {
			autoClose: 2000,
			pauseOnHover: false,
		});
		setTimeout(() => {
			window.location.reload(true);
		}, 2000);
	} catch (err) {
		toast.error("Error logging out. Please try again later.");
	}
};

const Msg = ({ closeToast, user }) => (
	<div className="header-toast">
		<p>{user.username.toUpperCase()}</p>
		<button className="header-toast-logout" onClick={logout}>
			Logout
		</button>
		<button onClick={() => history.push(`/user/${user.username}`)}>
			My Profile
		</button>
	</div>
);

const Header = ({ user }) => {
	return (
		<header>
			<nav className="header">
				<div className="header-content">
					<div className="header-logo">
						<Link to="/">Finstagram</Link>
					</div>
					<ul className="header-navLinks">
						<li>
							<img
								src={user.photo}
								alt={`${user.username}'s profile`}
								className="header-profile"
								onClick={() =>
									toast(<Msg user={user} />, {
										autoClose: 10000,
									})
								}
							/>
						</li>
					</ul>
				</div>
			</nav>
		</header>
	);
};

export default Header;

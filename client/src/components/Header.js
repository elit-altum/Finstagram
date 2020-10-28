import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { FaRegCompass as CompassIcon } from "react-icons/fa";
import { FaRegBell as BellIcon2 } from "react-icons/fa";

import { history } from "../router/router";

import { toast } from "react-toastify";

const Header = ({
	user,
	logoutUser,
	clearTimeline,
	notifications,
	notificationsLoading,
}) => {
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
			logoutUser();
			clearTimeline();
		} catch (err) {
			toast.error("Error logging out. Please try again later.");
		}
	};

	const Msg = ({ user }) => (
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

	let showDot = notifications
		? !notificationsLoading && !notifications[0].read
		: false;

	return (
		<header>
			<nav className="header">
				<div className="header-content">
					<div className="header-logo">
						<Link to="/">Finstagram</Link>
					</div>
					<ul className="header-navLinks">
						<li className="bell-icon">
							{showDot && <div className="notif-red-dot"></div>}
							<Link to="/notifications">
								<BellIcon2 />
							</Link>
						</li>
						<li className="discover-icon">
							<Link to="/trending">
								<CompassIcon />
							</Link>
						</li>
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

const mapDispatchToProps = (dispatch) => ({
	logoutUser: () => dispatch({ type: "USER_NOT_FOUND" }),
	clearTimeline: () => dispatch({ type: "CLEAR_TIMELINE" }),
});

const mapStateToProps = (state) => ({
	user: state.auth.user,
	loading: state.auth.loading,
	notifications: state.notifications.notifications,
	notificationsLoading: state.notifications.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

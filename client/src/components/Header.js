import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user }) => {
	return (
		<header>
			<nav className="header">
				<div className="header-content">
					<div className="header-logo">
						<Link to="/">Finstagram</Link>
					</div>
					<ul className="header-navLinks">
						{/* <li>{user.username.toUpperCase()}</li> */}
						<li>
							<Link to="/">
								<img
									src={user.photo}
									alt={`${user.username}'s profile`}
									className="header-profile"
								/>
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		</header>
	);
};

export default Header;

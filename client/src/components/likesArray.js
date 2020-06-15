import React from "react";

import { history } from "../router/router";

export const UserInfoSmall = ({ user }) => {
	return (
		<div className="like-modal__item">
			<div className="like-modal__item--profile">
				<img src={`${user.photo}`} alt={`${user.username}'s profile`} />
			</div>
			<div className="like-modal__item--names">
				<p
					className="like-modal__item--username"
					onClick={() => history.push(`/${user.username}`)}
				>
					{user.username}
				</p>
				<p className="like-modal__item--name">{user.name}</p>
			</div>
		</div>
	);
};

const LikesArray = ({ likes }) => {
	return (
		<div className="like-modal__list">
			<h3>Liked By</h3>
			{likes.map((like) => (
				<UserInfoSmall user={like.likedBy} key={like._id} />
			))}
		</div>
	);
};

export default LikesArray;

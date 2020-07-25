import React from "react";

import { history } from "../router/router";
import Loader from "./Loader";

export const UserInfoSmall = ({ user }) => {
	return (
		<div className="like-modal__item">
			<div className="like-modal__item--profile">
				<img src={`${user.photo}`} alt={`${user.username}'s profile`} />
			</div>
			<div className="like-modal__item--names">
				<p
					className="like-modal__item--username"
					onClick={() => history.push(`/user/${user.username}`)}
				>
					{user.username}
				</p>
				<p className="like-modal__item--name">{user.name}</p>
			</div>
		</div>
	);
};

const LikesArray = ({ likes }) => (
	<div className="like-modal__list">
		<h3>Liked By</h3>
		{!!likes.length ? (
			likes.map((like) => <UserInfoSmall user={like.likedBy} key={like._id} />)
		) : (
			<div className="likesLoader">
				<Loader />
			</div>
		)}
	</div>
);

export default LikesArray;

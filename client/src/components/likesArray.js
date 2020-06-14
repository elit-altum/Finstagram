import React from "react";

const Like = ({ like }) => {
	return (
		<div className="like-modal__item">
			<div className="like-modal__item--profile">
				<img
					src={`${like.likedBy.photo}`}
					alt={`${like.likedBy.username}'s profile`}
				/>
			</div>
			<div className="like-modal__item--names">
				<p className="like-modal__item--username">{like.likedBy.username}</p>
				<p className="like-modal__item--name">{like.likedBy.name}</p>
			</div>
		</div>
	);
};

const LikesArray = ({ likes }) => {
	return (
		<div className="like-modal__list">
			<h3>Liked By</h3>
			{likes.map((like) => (
				<Like like={like} key={like._id} />
			))}
		</div>
	);
};

export default LikesArray;

import React from "react";

const Comment = ({ comment }) => {
	return (
		<div className="comment">
			<div className="comment--meta">
				<img
					src={comment.createdBy.photo}
					alt={`${comment.createdBy.username}'s profile`}
				/>
				<p className="comment--username">{comment.createdBy.username}</p>
			</div>
			<p className="comment--body">{comment.body}</p>
		</div>
	);
};

export default Comment;

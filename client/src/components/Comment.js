import React from "react";
import { AiFillDelete as DeleteIcon } from "react-icons/ai";

const Comment = ({ comment, user, removeComment }) => {
	const isUser = user.id === comment.createdBy.id;
	return (
		<div className="comment">
			<div className="comment--meta">
				<img
					src={comment.createdBy.photo}
					alt={`${comment.createdBy.username}'s profile`}
				/>
				<p className="comment--username">{comment.createdBy.username}</p>
				<p className="comment--body">{comment.body}</p>
			</div>
			{!!isUser && (
				<div className="comment--delete">
					<DeleteIcon
						onClick={() => removeComment(comment._id)}
						title="Delete Comment"
					/>
				</div>
			)}
		</div>
	);
};

export default Comment;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment";

import { AiOutlineSend as SendIcon } from "react-icons/ai";

const Comments = ({ id }) => {
	const [comments, setComments] = useState([]);

	const createComment = async (e) => {
		e.preventDefault();
		try {
			const res = await axios({
				url: `/api/v1/posts/${id}/comments`,
				method: "POST",
				data: {
					comment: document.getElementById("comment-field").value,
				},
			});
			document.getElementById("comment-field").value = "";
			setComments(comments.concat([res.data.data.comment]));
		} catch (err) {}
	};

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const res = await axios({
					url: `/api/v1/posts/${id}/comments`,
					method: "GET",
				});
				setComments(res.data.data.comments);
			} catch (err) {}
		};
		fetchComments();
	}, []);

	return (
		<div className="commentArray">
			<h3>Comments</h3>
			<div className="commentsArray-list">
				{comments.map((comment) => (
					<Comment comment={comment} key={comment._id} />
				))}
			</div>
			<div className="createComment-form">
				<form onSubmit={createComment}>
					<input
						type="text"
						name="comment"
						required={true}
						id="comment-field"
						placeholder="Add Comment"
					/>
					<button type="submit">
						<SendIcon />
					</button>
				</form>
			</div>
		</div>
	);
};

export default Comments;

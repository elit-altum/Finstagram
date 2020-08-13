import React, { useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment";

import { connect } from "react-redux";

import { AiOutlineSend as SendIcon } from "react-icons/ai";

const Comments = ({ id, user, timelinePosts, updateTimeline }) => {
	const [comments, setComments] = useState([]);

	// Update redux store when a post is liked/unliked
	const updateStore = (postId, commentsCount) => {
		const newTimeline = [...timelinePosts];

		// 1. Update the comment count for timeline posts
		newTimeline.forEach((post) => {
			if (post._id === postId) {
				post.comments = commentsCount;
			}
		});

		updateTimeline(newTimeline);
	};

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

			const newArray = comments.concat([res.data.data.comment]);
			setComments(newArray);

			updateStore(id, newArray.length);
		} catch (err) {}
	};

	const removeComment = async (commentId) => {
		try {
			await axios({
				url: `/api/v1/posts/${id}/comment/${commentId}`,
				method: "DELETE",
			});
			const newArray = comments.filter((comment) => comment._id !== commentId);
			setComments(newArray);
			updateStore(id, newArray.length);
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
					<Comment
						comment={comment}
						key={comment._id}
						user={user}
						removeComment={removeComment}
					/>
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

const mapStateToProps = (state) => ({
	timelinePosts: state.timeline.posts,
});

const mapDispatchToProps = (dispatch) => ({
	updateTimeline: (newTimeline) =>
		dispatch({ type: "PUT_TIMELINE_ON_CHANGE", posts: newTimeline }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Comments);

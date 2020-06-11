import React, { useState } from "react";
import { AiOutlineHeart as HeartOutline } from "react-icons/ai";
import { AiOutlineComment as CommentOutline } from "react-icons/ai";

const Post = ({ post }) => {
	const [liked, setLiked] = useState(post.likedByMe);

	const getTime = (date) => {
		const givenDate = new Date(date).setHours(0, 0, 0, 0);
		const today = new Date(Date.now()).setHours(0, 0, 0, 0);

		const difference = today - givenDate;
		console.log(difference);

		const dateObj = {
			0: "Today",
			86400000: "Yesterday",
		};

		return (
			dateObj[difference] ||
			new Date(date).toLocaleDateString("en-us", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		);
	};

	return (
		<div className="postCard">
			<div className="postCard__userInfo">
				<img
					src={post.createdBy.photo}
					alt={`${post.createdBy.username}'s profile`}
				/>
				<p>{post.createdBy.username}</p>
			</div>
			<div className="postCard__image">
				<img src={post.photo} alt={`${post.createdBy.username}'s post`} />
			</div>
			<div className="postCard__meta">
				<div className="postCard__meta--icons">
					<HeartOutline />
					<CommentOutline />
				</div>
			</div>
			{!!post.likes && (
				<p className="postCard__likes">{`${post.likes} ${
					post.likes === 1 ? "like" : "likes"
				}`}</p>
			)}
			<div className="postCard__caption">
				<p className="postCard__caption--username">{post.createdBy.username}</p>
				<p className="postCard__caption--body">{post.caption}</p>
			</div>
			{!!post.comments && (
				<div className="postCard__comments">{`View ${post.comments} ${
					post.comments === 1 ? "comment" : "comments"
				}`}</div>
			)}
			<p className="postCard__date">{getTime(post.createdAt)}</p>
		</div>
	);
};

export default Post;

Post.defaultProps = {
	post: {
		_id: "5edf5aec3561dd32206cecc1",
		caption: "My Niece is good!",
		photo: "/img/posts/post-5edf42f57e58a1049ca59e8a-1591696108114.jpg",
		dimensions: "1000 x 1000",
		createdBy: {
			photo: "/img/user-profiles/default.png",
			_id: "5edf42f57e58a1049ca59e8a",
			username: "jayantxk",
			id: "5edf42f57e58a1049ca59e8a",
		},
		createdAt: "2020-06-09T09:48:28.166Z",
		updatedAt: "2020-06-09T09:48:28.166Z",
		__v: 0,
		likes: 21,
		comments: 40,
		id: "5edf5aec3561dd32206cecc1",
		likedByMe: true,
	},
};

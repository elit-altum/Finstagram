import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

import LikesArray from "./likesArray";

import {
	AiOutlineHeart as HeartOutline,
	AiFillHeart as HeartFill,
} from "react-icons/ai";
import { AiOutlineComment as CommentOutline } from "react-icons/ai";

const Post = ({ post }) => {
	const [isLiked, setIsLiked] = useState(post.likedByMe);
	const [likes, setLikes] = useState(post.likes * 1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [allLikes, setAllLikes] = useState([]);

	const openLikeModal = () => {
		setIsModalOpen(true);
	};

	const closeLikeModal = () => {
		setIsModalOpen(false);
	};

	const showLikes = async () => {
		const url = `/api/v1/posts/${post.id}/likedBy`;
		try {
			const res = await axios({
				url,
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
				},
			});
			setAllLikes(res.data.data.likers);
			console.log(res);
		} catch (err) {
			console.log(err.response);
		}
		openLikeModal();
	};

	const getTime = (date) => {
		const givenDate = new Date(date).setHours(0, 0, 0, 0);
		const today = new Date(Date.now()).setHours(0, 0, 0, 0);

		const difference = today - givenDate;

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

	const createLike = async () => {
		const url = `/api/v1/posts/${post.id}/like`;
		try {
			await axios({
				url,
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
				},
			});
		} catch (err) {
			setIsLiked(!isLiked);
		}
	};

	const removeLike = async () => {
		const url = `/api/v1/posts/${post.id}/unlike`;
		try {
			await axios({
				url,
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
				},
			});
		} catch (err) {
			setIsLiked(!isLiked);
		}
	};

	const handleLike = async () => {
		const likedCopy = isLiked;
		setIsLiked(!isLiked);

		if (likedCopy) {
			setLikes(likes - 1);
			await removeLike();
		} else {
			setLikes(likes + 1);
			await createLike();
		}
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
					{isLiked ? (
						<HeartFill style={{ color: "#b71c1c" }} onClick={handleLike} />
					) : (
						<HeartOutline onClick={handleLike} />
					)}
					<CommentOutline />
				</div>
			</div>
			{!!post.likes && (
				<p onClick={showLikes} className="postCard__likes">
					{`${likes} ${post.likes === 1 ? "like" : "likes"}`}
				</p>
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
			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeLikeModal}
				ariaHideApp={false}
				contentLabel="Like Modal"
				closeTimeoutMS={200}
				className="modal"
			>
				<LikesArray likes={allLikes} />
			</Modal>
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
		likedByMe: false,
	},
};

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Link } from "react-router-dom";

import LikesArray from "./likesArray";

import { history } from "../router/router";

import {
	AiOutlineHeart as HeartOutline,
	AiFillHeart as HeartFill,
} from "react-icons/ai";
import { AiOutlineComment as CommentOutline } from "react-icons/ai";

const Post = ({ post, rank }) => {
	const [isLiked, setIsLiked] = useState(post.likedByMe);
	const [likes, setLikes] = useState(post.likes * 1);
	const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
	const [allLikes, setAllLikes] = useState([]);

	const openLikeModal = () => {
		setIsLikeModalOpen(true);
	};

	const closeLikeModal = () => {
		setIsLikeModalOpen(false);
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

	const fetchLikes = async () => {
		const url = `/api/v1/posts/${post._id}/likedBy`;
		try {
			const res = await axios({
				url,
				method: "GET",
			});
			setAllLikes(res.data.data.likers);
		} catch (err) {}
	};

	const createLike = async () => {
		const url = `/api/v1/posts/${post._id}/like`;
		try {
			await axios({
				url,
				method: "GET",
			});
		} catch (err) {
			// console.log(err.response);
			setIsLiked(!isLiked);
		}
	};

	const removeLike = async () => {
		const url = `/api/v1/posts/${post._id}/unlike`;
		try {
			await axios({
				url,
				method: "GET",
			});
		} catch (err) {
			// console.log(err.response);
			setIsLiked(!isLiked);
		}
	};

	const handleLike = async () => {
		const likedCopy = isLiked;
		setIsLiked(!isLiked);
		setAllLikes([]);

		if (likedCopy) {
			setLikes(likes - 1);
			await removeLike();
		} else {
			setLikes(likes + 1);
			await createLike();
		}

		await fetchLikes();
	};

	useEffect(() => {
		fetchLikes();
	}, []);

	return (
		!!post._id && (
			<div className="postCard">
				<div className="postCard__userInfo">
					<img
						src={post.createdBy.photo}
						alt={`${post.createdBy.username}'s profile`}
					/>
					<p onClick={() => history.push(`/user/${post.createdBy.username}`)}>
						{post.createdBy.username}
					</p>
				</div>
				{!!rank && (
					<div className="postCard__trending">
						<p># {rank} on trending</p>
					</div>
				)}
				<div className="postCard__image">
					<img
						src={post.photo}
						alt={`${post.createdBy.username}'s post`}
						onDoubleClick={handleLike}
					/>
				</div>
				<div className="postCard__meta">
					<div className="postCard__meta--icons">
						{isLiked ? (
							<HeartFill style={{ color: "#b71c1c" }} onClick={handleLike} />
						) : (
							<HeartOutline onClick={handleLike} />
						)}
						<Link to={`/post/${post._id}`}>
							<CommentOutline />
						</Link>
					</div>
				</div>
				{!!likes && (
					<p onClick={openLikeModal} className="postCard__likes">
						{`${likes} ${likes === 1 ? "like" : "likes"}`}
					</p>
				)}
				<div className="postCard__caption">
					<p
						className="postCard__caption--username"
						onClick={() => history.push(`/user/${post.createdBy.username}`)}
					>
						{post.createdBy.username}
					</p>
					<p className="postCard__caption--body">{post.caption}</p>
				</div>
				{!!post.comments && (
					<Link to={`/post/${post._id}`} className="postCard__comments">
						<p>{`View ${post.comments} ${
							post.comments === 1 ? "comment" : "comments"
						}`}</p>
					</Link>
				)}
				<p className="postCard__date">{getTime(post.createdAt)}</p>
				<Modal
					isOpen={isLikeModalOpen}
					onRequestClose={closeLikeModal}
					ariaHideApp={false}
					contentLabel="Like Modal"
					closeTimeoutMS={200}
					className="modal"
				>
					<LikesArray likes={allLikes} />
				</Modal>
			</div>
		)
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

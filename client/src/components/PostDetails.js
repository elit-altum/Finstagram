import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "react-modal";

import { history } from "../router/router";

import {
	AiOutlineHeart as HeartOutline,
	AiFillHeart as HeartFill,
} from "react-icons/ai";

import PageLoader from "./PageLoader";
import Comments from "./Comments";
import LikesArray from "./likesArray";

const PostDetails = ({ user }) => {
	const { postId } = useParams();

	const [post, setPost] = useState({});
	const [allLikes, setAllLikes] = useState();

	const [isLiked, setIsLiked] = useState(post.likedByMe);
	const [likes, setLikes] = useState(post.likes * 1);
	const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);

	const fetchPost = async () => {
		try {
			const res = await axios({
				url: `/api/v1/posts/one/${postId}`,
				method: "GET",
			});
			const post = res.data.results.post;
			setPost(post);
			setIsLiked(post.likedByMe);
			setLikes(post.likes * 1);
		} catch (err) {}
	};

	useEffect(() => {
		fetchPost();
	}, []);

	const openLikeModal = () => {
		setIsLikeModalOpen(true);
	};

	const closeLikeModal = () => {
		setIsLikeModalOpen(false);
	};

	const showLikes = async () => {
		const url = `/api/v1/posts/${postId}/likedBy`;
		try {
			const res = await axios({
				url,
				method: "GET",
			});
			setAllLikes(res.data.data.likers);
			openLikeModal();
		} catch (err) {}
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
		const url = `/api/v1/posts/${postId}/like`;
		try {
			const res = await axios({
				url,
				method: "GET",
			});
			// console.log(res.data);
		} catch (err) {
			setIsLiked(!isLiked);
			// console.log(err.response);
		}
	};

	const removeLike = async () => {
		const url = `/api/v1/posts/${postId}/unlike`;
		try {
			const res = await axios({
				url,
				method: "GET",
			});
			// console.log(res.data);
		} catch (err) {
			setIsLiked(!isLiked);
			// console.log(err.response);
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

	return !!post.id ? (
		<div className="postDetails">
			<div className="postDetails--info">
				<div className="postDetails--meta">
					<img
						src={post.createdBy.photo}
						alt={`${post.createdBy.username}'s profile`}
					/>
					<p
						className="postDetails--username"
						onClick={() => history.push(`/user/${post.createdBy.username}`)}
					>
						{post.createdBy.username}
					</p>
				</div>
				<div className="postDetails--image">
					<img
						src={post.photo}
						alt={`${post.createdBy.username}'s post`}
						onDoubleClick={handleLike}
					/>
				</div>
				<div className="postDetails__likes">
					{isLiked ? (
						<HeartFill style={{ color: "#b71c1c" }} onClick={handleLike} />
					) : (
						<HeartOutline onClick={handleLike} />
					)}
					{!!likes && (
						<p onClick={showLikes} className="postDetails__likes--count">
							{`${likes} ${likes === 1 ? "like" : "likes"}`}
						</p>
					)}
				</div>
				<p className="postCard__date">{getTime(post.createdAt)}</p>
			</div>
			<div className="postDetails--details">
				<Comments id={postId} user={user} />
			</div>
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
	) : (
		<PageLoader />
	);
};

export default PostDetails;

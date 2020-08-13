import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { connect } from "react-redux";

import { history } from "../router/router";

import {
	AiOutlineHeart as HeartOutline,
	AiFillHeart as HeartFill,
} from "react-icons/ai";

import PageLoader from "./PageLoader";
import Comments from "./Comments";
import LikesArray from "./likesArray";

const PostDetails = ({
	user,
	timelinePosts,
	trendingPosts,
	updateTimeline,
	updateTrending,
}) => {
	const { postId } = useParams();

	const [post, setPost] = useState({});
	const [allLikes, setAllLikes] = useState();

	const [isLiked, setIsLiked] = useState(post.likedByMe);
	const [likes, setLikes] = useState(post.likes * 1);
	const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);

	// a. Fetch the post to display
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

	// b. Calculate time of post creation
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

	// c. Open Modal showing all likers
	const openLikeModal = () => {
		setIsLikeModalOpen(true);
	};

	// d. Close Modal showing all likers
	const closeLikeModal = () => {
		setIsLikeModalOpen(false);
	};

	// e. Fetch all people who liked the post
	const fetchLikes = async () => {
		const url = `/api/v1/posts/${postId}/likedBy`;
		try {
			const res = await axios({
				url,
				method: "GET",
			});
			setAllLikes(res.data.data.likers);
		} catch (err) {}
	};

	// f. Inform the database that user has liked the post
	const createLike = async () => {
		const url = `/api/v1/posts/${postId}/like`;
		try {
			const res = await axios({
				url,
				method: "GET",
			});
		} catch (err) {
			setIsLiked(!isLiked);
		}
	};

	// g. Inform the database that user has unliked the post
	const removeLike = async () => {
		const url = `/api/v1/posts/${postId}/unlike`;
		try {
			const res = await axios({
				url,
				method: "GET",
			});
		} catch (err) {
			setIsLiked(!isLiked);
		}
	};

	// h. Update redux store when a post is liked/unliked
	const updateStore = (postId, likesCount, likedByMe) => {
		console.log("yay");
		const newTimeline = [...timelinePosts];
		const newTrending = [...trendingPosts];

		// 1. Update the likes count and likedByMe for timeline posts
		newTimeline.forEach((post) => {
			if (post._id === postId) {
				post.likedByMe = likedByMe;
				post.likes = likesCount;
			}
		});

		// 2. Update the likes count and likedByMe for trending posts
		newTrending.forEach((post) => {
			if (post._id === postId) {
				post.likedByMe = likedByMe;
				post.likes = likesCount;
			}
		});

		updateTimeline(newTimeline);
		updateTrending(newTrending);
	};

	// i. Updates store and state using above func.
	const handleLike = async () => {
		const likedCopy = isLiked;
		setIsLiked(!isLiked);
		setAllLikes([]);

		if (likedCopy) {
			setLikes(likes - 1);
			updateStore(post._id, likes - 1, !likedCopy);
			await removeLike();
		} else {
			setLikes(likes + 1);
			updateStore(post._id, likes + 1, !likedCopy);
			await createLike();
		}

		await fetchLikes();
	};

	useEffect(() => {
		fetchPost();
		fetchLikes();
	}, []);

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
						<p onClick={openLikeModal} className="postDetails__likes--count">
							{`${likes} ${likes === 1 ? "like" : "likes"}`}
						</p>
					)}
				</div>
				<div className="postCard__caption">
					<p
						className="postCard__caption--username"
						onClick={() => history.push(`/user/${post.createdBy.username}`)}
					>
						{post.createdBy.username}
					</p>
					<p className="postCard__caption--body">{post.caption}</p>
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

const mapStateToProps = (state) => ({
	timelinePosts: state.timeline.posts,
	trendingPosts: state.trending.posts,
});

const mapDispatchToProps = (dispatch) => ({
	updateTimeline: (newTimeline) =>
		dispatch({ type: "PUT_TIMELINE_ON_CHANGE", posts: newTimeline }),
	updateTrending: (newTrending) =>
		dispatch({ type: "PUT_TRENDING", posts: newTrending }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);

import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Modal from "react-modal";

import {
	AiOutlineHeart as HeartOutline,
	AiOutlineComment as CommentOutline,
	AiOutlinePlus as AddIcon,
	AiOutlineEdit as EditIcon,
} from "react-icons/ai";

import { toast } from "react-toastify";

import NotFound from "./NotFound";
import PageLoader from "./PageLoader";
import { UserInfoSmall } from "./likesArray";

import { history } from "../router/router";

const Post = ({ post }) => {
	return (
		<div className="post-container">
			<img
				src={post.photo}
				className="post-container__image"
				alt="My-Post"
				onClick={() => history.push(`/post/${post.id}`)}
			/>
			<div className="post-container__details">
				<div className="post-container__details--likes">
					<HeartOutline />
					<p>{post.likes}</p>
				</div>
				<div className="post-container__details--comments">
					<CommentOutline />
					<p>{post.comments}</p>
				</div>
			</div>
		</div>
	);
};

const UserProfile = (props) => {
	const { username } = useParams();

	const notMe = props.user.username !== username;

	const [user, setUser] = useState();
	const [posts, setPosts] = useState();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [usersArray, setUsersArray] = useState([]);
	const [followersArray, setFollowersArray] = useState([]);
	const [followingArray, setFollowingArray] = useState([]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setUsersArray([]);
	};

	const followUser = async (username) => {
		let newFollowersCount = user.followersCount + 1;
		setUser({
			...user,
			followedByMe: true,
			followersCount: newFollowersCount,
		});
		try {
			const url = `/api/v1/users/${username}/follow`;
			const res = await axios({
				url,
				method: "GET",
			});

			props.fetchTimeline();
			toast.success(res.data.message, {
				autoClose: 5000,
				pauseOnHover: false,
			});
		} catch (err) {
			console.log(err);
			toast.success(err.response.data.error.message, {
				autoClose: 5000,
				pauseOnHover: false,
			});
		}
	};

	const unfollowUser = async (username) => {
		let newFollowersCount = user.followersCount - 1;
		setUser({
			...user,
			followedByMe: false,
			followersCount: newFollowersCount,
		});
		try {
			const url = `/api/v1/users/${username}/unfollow`;
			const res = await axios({
				url,
				method: "GET",
			});
			props.fetchTimeline();
			toast.success(res.data.message, {
				autoClose: 5000,
				pauseOnHover: false,
			});
		} catch (err) {
			console.log(err.response);
			toast.success(err.response.data.error.message, {
				autoClose: 5000,
				pauseOnHover: false,
			});
		}
	};

	const fetchUser = async () => {
		try {
			const url = `/api/v1/users/user/${username}`;
			const res = await axios({
				url,
				method: "GET",
			});
			setUser(res.data.data.user);
			setPosts(res.data.data.posts);
		} catch (err) {}
	};

	const fetchFollows = async () => {
		try {
			const url = `/api/v1/users/${username}/follows`;
			const res = await axios({
				url,
				method: "GET",
			});
			setFollowingArray(res.data.data.user.follows);
		} catch (err) {}
	};

	const fetchFollowers = async () => {
		try {
			const url = `/api/v1/users/${username}/followers`;
			const res = await axios({
				url,
				method: "GET",
			});
			setFollowersArray(res.data.data.followers);
		} catch (err) {}
	};

	const showFollows = () => {
		setUsersArray(followingArray);
		openModal();
	};

	const showFollowers = () => {
		setUsersArray(followersArray);
		openModal();
	};

	useEffect(() => {
		fetchUser();
		fetchFollowers();
		fetchFollows();
	}, []);

	return !!user && !!posts ? (
		<div className="user-page">
			<div className="user-info">
				<div className="user-profile">
					<img src={user.photo} alt={`${user.username}'s profile`} />
					<p className="user-profile__name">{user.name}</p>
					<p className="user-profile__username">{user.username}</p>
				</div>
				<div className="user-meta">
					<div className="user-stats">
						<div className="user-stats--posts">
							<h3>{user.postsCount}</h3>
							<p>Posts</p>
						</div>
						<div
							className="user-stats--followers"
							onClick={!!user.followersCount ? showFollowers : null}
						>
							<h3>{user.followersCount}</h3>
							<p>Followers</p>
						</div>
						<div
							className="user-stats--follows"
							onClick={!!user.followCount ? showFollows : null}
						>
							<h3>{user.followCount}</h3>
							<p>Follows</p>
						</div>
					</div>
					{!!notMe &&
						(user.followedByMe ? (
							<button
								className="user-following-button"
								onClick={() => unfollowUser(user.username)}
							>
								Following
							</button>
						) : (
							<button
								className="user-follow-button"
								onClick={() => followUser(user.username)}
							>
								Follow
							</button>
						))}
				</div>
			</div>
			{!!posts.length ? (
				<div className="user-posts">
					{posts.map((post) => (
						<Post post={post} key={post._id} />
					))}
				</div>
			) : (
				<NotFound message={"No posts yet."} />
			)}
			{!!!notMe && (
				<div className="cta-buttons">
					<button
						className="newPost-button"
						onClick={() => history.push("/post/create")}
						title="Create New Post"
					>
						<AddIcon />
					</button>
					<button
						className="editMe-button"
						onClick={() => history.push("/update")}
						title="Edit Details"
					>
						<EditIcon />
					</button>
				</div>
			)}
			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				ariaHideApp={false}
				contentLabel="Like Modal"
				closeTimeoutMS={200}
				className="modal"
			>
				<div className="like-modal__list">
					{usersArray.map((user) => (
						<UserInfoSmall
							user={user.follows.name ? user.follows : user.user}
							key={user._id}
						/>
					))}
				</div>
			</Modal>
		</div>
	) : (
		<PageLoader />
	);
};

const mapDispatchToProps = (dispatch) => ({
	fetchTimeline: () => dispatch({ type: "FETCH_TIMELINE" }),
});

export default connect(null, mapDispatchToProps)(UserProfile);

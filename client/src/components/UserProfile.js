import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { AiOutlineHeart as HeartOutline } from "react-icons/ai";
import { AiOutlineComment as CommentOutline } from "react-icons/ai";

import NotFound from "./NotFound";

const Post = ({ post }) => {
	return (
		<div class="post-container">
			<img src={post.photo} class="post-container__image" alt="My-Post" />
			<div class="post-container__details">
				<div class="post-container__details--likes">
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

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		!!user &&
		!!posts && (
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
							<div className="user-stats--followers">
								<h3>{user.followersCount}</h3>
								<p>Followers</p>
							</div>
							<div className="user-stats--follows">
								<h3>{user.followCount}</h3>
								<p>Follows</p>
							</div>
						</div>
						{!!notMe &&
							(user.followedByMe ? (
								<div className="user-following">Following</div>
							) : (
								<button className="user-follow-button">Follow</button>
							))}
					</div>
				</div>
				{!!posts.length ? (
					<div className="user-posts">
						{posts.map((post) => (
							<Post post={post} />
						))}
					</div>
				) : (
					<NotFound />
				)}
			</div>
		)
	);
};

export default UserProfile;

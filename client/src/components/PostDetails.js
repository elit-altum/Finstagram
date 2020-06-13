import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comments from "./Comments";

const PostDetails = () => {
	const { postId } = useParams();

	const [post, setPost] = useState({});
	const [likes, setLikes] = useState([]);

	const fetchPost = async () => {
		try {
			const res = await axios({
				url: `/api/v1/posts/one/${postId}`,
				method: "GET",
			});
			setPost(res.data.results.post);
		} catch (err) {}
	};

	const fetchLikes = async () => {
		try {
			const res = await axios({
				url: `/api/v1/posts/${postId}/likedBy`,
				method: "GET",
			});
			setLikes(res.data.data.likers);
		} catch (err) {}
	};

	useEffect(() => {
		fetchPost();
		fetchLikes();
	}, []);

	return (
		!!post.id && (
			<div className="postDetails">
				<div className="postDetails--meta">
					<img
						src={post.createdBy.photo}
						alt={`${post.createdBy.username}'s profile`}
					/>
					<p className="postDetails--username">{post.createdBy.username}</p>
				</div>
				<div className="postDetails--image">
					<img src={post.photo} alt={`${post.createdBy.username}'s post`} />
				</div>
				<div className="postDetails--details">
					<Comments id={postId} />
				</div>
			</div>
		)
	);
};

export default PostDetails;

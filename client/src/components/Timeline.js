import React, { useState, useEffect } from "react";
import axios from "axios";

import { BsSearch as SearchIcon } from "react-icons/bs";

import NotFound from "./NotFound";
import PageLoader from "./PageLoader";
import Post from "./Post";

import { history } from "../router/router";

let renderCounter = 0;

const Timeline = (props) => {
	const [posts, setPosts] = useState(["init"]);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const url = "/api/v1/posts/feed";
				const res = await axios({
					url,
					method: "GET",
				});
				renderCounter++;
				setPosts(res.data.data.posts);
			} catch (err) {
				renderCounter++;
			}
		};

		fetchPost();
	}, []);

	return (
		<div className="my-timeline">
			{!!renderCounter ? (
				!!posts.length ? (
					posts.map((post) => <Post post={post} key={post.id} />)
				) : (
					<div className="no-posts">
						<NotFound
							message={
								"No posts found. Please follow users to view a timeline."
							}
						/>
					</div>
				)
			) : (
				<PageLoader />
			)}
			<div className="cta-buttons">
				<button
					className="searchUsers-button"
					onClick={() => history.push("/searchUsers")}
					title="Search Users"
				>
					<SearchIcon />
				</button>
			</div>
		</div>
	);
};

export default Timeline;

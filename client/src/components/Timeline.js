import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";

import NotFound from "./NotFound";

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
			{!!renderCounter &&
				(!!posts.length ? (
					posts.map((post) => <Post post={post} key={post.id} />)
				) : (
					<NotFound
						message={"No posts found. Please follow users to view a timeline."}
					/>
				))}
		</div>
	);
};

export default Timeline;

import React from "react";
import { connect } from "react-redux";

import { BsSearch as SearchIcon } from "react-icons/bs";

import NotFound from "./NotFound";
import PageLoader from "./PageLoader";
import Post from "./Post";

import { history } from "../router/router";

const Timeline = ({ posts, loading }) => {
	return (
		<div className="my-timeline">
			{!loading ? (
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

const mapStateToProps = (state) => ({
	posts: state.timeline.posts,
	loading: state.timeline.loading,
});

export default connect(mapStateToProps, null)(Timeline);

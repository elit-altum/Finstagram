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
					posts.map((post, index) => (
						<Post post={post} rank={index + 1} key={post._id} />
					))
				) : (
					<div className="no-posts">
						<NotFound message={"Nothing Here."} />
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
	posts: state.trending.posts,
	loading: state.trending.loading,
});

export default connect(mapStateToProps, null)(Timeline);

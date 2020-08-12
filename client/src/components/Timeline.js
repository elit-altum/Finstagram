import React from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import { BsSearch as SearchIcon } from "react-icons/bs";

import NotFound from "./NotFound";
import PageLoader from "./PageLoader";
import Post from "./Post";

import { history } from "../router/router";

const endOfPosts = (
	<div className="timeline-end">
		<p>--x--</p>
	</div>
);

const loadingPosts = <div className="timeline-loader"></div>;

const Timeline = ({ posts, loading, page, end, fetchScrollingTimeline }) => {
	return (
		<div className="my-timeline">
			{!loading ? (
				!!posts.length ? (
					<InfiniteScroll
						dataLength={posts.length}
						next={() => fetchScrollingTimeline(page + 1)}
						hasMore={!end}
						endMessage={endOfPosts}
						loader={loadingPosts}
					>
						{posts.map((post) => (
							<Post post={post} key={post.id} />
						))}
					</InfiniteScroll>
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
	page: Number(state.timeline.page),
	end: state.timeline.end,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	fetchScrollingTimeline: (page) =>
		dispatch({ type: "FETCH_TIMELINE_SCROLLING", page }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);

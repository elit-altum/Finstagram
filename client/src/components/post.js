import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import LikesArray from "./likesArray";

import { history } from "../router/router";

import {
	AiOutlineHeart as HeartOutline,
	AiFillHeart as HeartFill,
  AiFillCaretDown as CaretDown
} from "react-icons/ai";
import { AiOutlineComment as CommentOutline } from "react-icons/ai";

const Post = ({
	post,
	rank,
	timelinePosts,
	trendingPosts,
	updateTimeline,
	updateTrending,
  isNearby
}) => {
	const [isLiked, setIsLiked] = useState(post.likedByMe);
	const [likes, setLikes] = useState(post.likes * 1);
	const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
	const [allLikes, setAllLikes] = useState([]);
	const [showLikeIcon, setShowLikeIcon] = useState(false);
  const [currReputation, setCurrReputation] = useState(post.reputation || 0);
  const [reportedByMe, setReportedByMe] = useState(post.reportedByMe);


	// a. Calculate time of post creation
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

	// b. Open Modal showing all likers
	const openLikeModal = () => {
		setIsLikeModalOpen(true);
	};

	// c. Close Modal showing all likers
	const closeLikeModal = () => {
		setIsLikeModalOpen(false);
	};

	// d. Update redux store when a post is liked/unliked
	const updateStore = (postId, likesCount, likedByMe) => {
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

	// e. Fetch all users who liked a post
	const fetchLikes = async () => {
		const url = `/api/v1/posts/${post._id}/likedBy`;
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
		setShowLikeIcon(true);
		setTimeout(() => {
			setShowLikeIcon(false);
		}, 800);
		const url = `/api/v1/posts/${post._id}/like`;
		try {
			await axios({
				url,
				method: "GET",
			});
		} catch (err) {
			setIsLiked(!isLiked);
		}
	};

	// g. Inform the database that user has unliked the post
	const removeLike = async () => {
		const url = `/api/v1/posts/${post._id}/unlike`;
		try {
			await axios({
				url,
				method: "GET",
			});
		} catch (err) {
			setIsLiked(!isLiked);
		}
	};

	// h. Updates store and state using above func.
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

  // i. Reputation update
  const handleReputation = async () => {
    if(reportedByMe) {
      setCurrReputation(currReputation + 1);
      setReportedByMe(false);
      const url = `/api/v1/posts/utils/unReport`;
      try {
        await axios({
          url,
          method: "POST",
          data: {
            post: post._id
          }
        });
      } catch (err) {
        setCurrReputation(currReputation - 1);
        setReportedByMe(true);
      }
    } else {
      const url = `/api/v1/posts/utils/report`;
      setCurrReputation(currReputation - 1);
      setReportedByMe(true);
      try {
        await axios({
          url,
          method: "POST",
          data: {
            post: post._id,
            status: "spam"
          }
        });
        
      } catch (err){
        setCurrReputation(currReputation + 1);
        setReportedByMe(false);
      }  
    }
  }


	useEffect(() => {
		fetchLikes();
	}, []);

	return (
		!!post._id && (
			<div className="postCard">
				<div className="postCard__userInfo">
					<img
						src={post.createdBy.photo}
						alt={`${post.createdBy.username}'s profile`}
					/>
					<div className="postCard__userInfo-meta">
						<p
							className="postCard__userInfo-username"
							onClick={() => history.push(`/user/${post.createdBy.username}`)}
						>
							{post.createdBy.username}
						</p>
						{!!post.locationName && (
							<div className="postCard__location">
								<Link
									to={`/post/nearby/${post.location.coordinates[0]},${post.location.coordinates[1]}`}
								>
									<p>{post.locationName}</p>
								</Link>
							</div>
						)}
					</div>
          {
            isNearby && ( < div className = "postCard__downvote">
                <CaretDown onClick = {handleReputation} color = {reportedByMe ? "#f44336" : ""}/>
                <p>{currReputation}</p>
              </div>
            )

          }
				</div>
				{!!rank && (
					<div className="postCard__trending">
						<p># {rank} on trending</p>
					</div>
				)}
				<div className="postCard__image">
					<img
						src={post.photo}
						alt={`${post.createdBy.username}'s post`}
						onDoubleClick={handleLike}
					/>
					{!!showLikeIcon && (
						<HeartFill className="postCase__image-like" id="post-like-icon" />
					)}
				</div>
				<div className="postCard__meta">
					<div className="postCard__meta--icons">
						{isLiked ? (
							<HeartFill style={{ color: "#b71c1c" }} onClick={handleLike} />
						) : (
							<HeartOutline onClick={handleLike} />
						)}
						<Link to={`/post/${post._id}`}>
							<CommentOutline />
						</Link>
					</div>
				</div>
				{!!likes && (
					<p onClick={openLikeModal} className="postCard__likes">
						{`${likes} ${likes === 1 ? "like" : "likes"}`}
					</p>
				)}
				<div className="postCard__caption">
					<p
						className="postCard__caption--username"
						onClick={() => history.push(`/user/${post.createdBy.username}`)}
					>
						{post.createdBy.username}
					</p>
					<p className="postCard__caption--body">{post.caption}</p>
				</div>
				{!!post.comments && (
					<Link to={`/post/${post._id}`} className="postCard__comments">
						<p>{`View ${post.comments} ${
							post.comments === 1 ? "comment" : "comments"
						}`}</p>
					</Link>
				)}
				<p className="postCard__date">{getTime(post.createdAt)}</p>
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
		)
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

export default connect(mapStateToProps, mapDispatchToProps)(Post);

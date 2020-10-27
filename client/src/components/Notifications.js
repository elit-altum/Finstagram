import React from "react";
import { connect } from "react-redux";
import { history } from "../router/router";
import GitHubButton from "react-github-btn";

import PageLoader from "./PageLoader";

const WelcomeNotification = () => {
	return (
		<div className="my-welcome-notif">
			<p className="my-welcome-notif-heading">
				Welcome to the Finstagram family! We can't wait to see what you do here!{" "}
				<br />
				This is an open source project, please show some love by starring or
				forking this repository.
				<br />
				Happy Browsing!
			</p>
			<div className="my-welcome-notif-gh-buttons">
				<GitHubButton
					href="https://github.com/elit-altum/Finstagram-The-Instagram-Clone"
					data-icon="octicon-star"
					data-size="large"
					data-show-count="true"
					aria-label="Star elit-altum/Finstagram-The-Instagram-Clone on GitHub"
				>
					Star
				</GitHubButton>
				<GitHubButton
					href="https://github.com/elit-altum/Finstagram-The-Instagram-Clone/fork"
					data-icon="octicon-repo-forked"
					data-size="large"
					data-show-count="true"
					aria-label="Fork elit-altum/Finstagram-The-Instagram-Clone on GitHub"
				>
					Fork
				</GitHubButton>
				<GitHubButton
					href="https://github.com/elit-altum"
					data-size="large"
					aria-label="Follow @elit-altum on GitHub"
				>
					Follow @elit-altum
				</GitHubButton>
			</div>
		</div>
	);
};

const Notification = ({ notif }) => {
	return (
		<div className="my-notif" onClick={() => history.push(notif.link)}>
			<div className="my-notif-details">
				<img className="my-notif-image" src={notif.photo} />
				<p className="my-notif-heading">{notif.message}</p>
			</div>
			{notif.post && <img className="my-notif-post" src={notif.post} />}
		</div>
	);
};

const Notifications = ({ loading, notifs }) => {
	return (
		<div class="notifs-page">
			{!loading ? (
				<div className="my-notifs">
					<WelcomeNotification />
					{notifs.map((notif, index) => (
						<Notification notif={notif} index={index + 1} />
					))}
				</div>
			) : (
				<PageLoader />
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	notifs: state.notifications.notifications,
	loading: state.notifications.loading,
});

export default connect(mapStateToProps, null)(Notifications);

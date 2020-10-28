import React, { useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import { connect } from "react-redux";
import * as actions from "../actions";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import Timeline from "../components/Timeline";
import Trending from "../components/TrendingPage";
import NearbyPosts from "../components/NearbyPosts";
import LoginForm from "../components/Login";
import SignupForm from "../components/Signup";
import PostDetail from "../components/PostDetails";
import UserProfile from "../components/UserProfile";
import CreatePost from "../components/CreatePost";
import EditUserProfile from "../components/EditUserProfile";
import SearchUsers from "../components/SearchUsers";
import PageNotFound from "../components/PageNotFound";
import PageLoader from "../components/PageLoader";
import Notifications from "../components/Notifications";

export const history = createBrowserHistory();

const AppRouter = (props) => {
	// Fetch initial states
	useEffect(() => {
		props.isLoggedIn();
		props.fetchTimeline();
		props.fetchTrending();
		props.fetchNotifications();
		setInterval(() => {
			props.checkNotifications();
		}, 5000);
	}, []);

	return !props.loading ? (
		<Router history={history}>
			<Switch>
				<PublicRoute path="/login" component={LoginForm} />
				<PublicRoute path="/signup" component={SignupForm} />

				<PrivateRoute path="/" component={Timeline} exact={true} />
				<PrivateRoute path="/trending" component={Trending} exact={true} />
				<PrivateRoute path="/post/create" component={CreatePost} exact={true} />
				<PrivateRoute
					path="/post/:postId"
					component={PostDetail}
					exact={true}
				/>
				<PrivateRoute
					path="/post/nearby/:center"
					component={NearbyPosts}
					exact={true}
				/>
				<PrivateRoute path="/update" component={EditUserProfile} exact={true} />
				<PrivateRoute
					path="/searchUsers"
					component={SearchUsers}
					exact={true}
				/>
				<PrivateRoute
					path="/user/:username"
					component={UserProfile}
					exact={true}
				/>
				<PrivateRoute
					path="/notifications"
					component={Notifications}
					exact={true}
				/>

				<Route path="/" component={PageNotFound} />
			</Switch>
		</Router>
	) : (
		<PageLoader />
	);
};

const mapDispatchToProps = (dispatch) => ({
	isLoggedIn: () => dispatch(actions.getAuthToken()),
	fetchTimeline: () => dispatch(actions.fetchMyTimeline()),
	fetchTrending: () => dispatch(actions.fetchTrendingPosts()),
	fetchNotifications: () => dispatch(actions.fetchNotifications()),
	checkNotifications: () => dispatch(actions.checkNotifications()),
});

const mapStateToProps = (state) => ({
	user: state.auth.user,
	loading: state.auth.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);

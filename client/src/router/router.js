import React from "react";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import Timeline from "../components/Timeline";
import LoginForm from "../components/Login";
import SignupForm from "../components/Signup";
import PostDetail from "../components/PostDetails";

export const history = createHistory();

const AppRouter = (props) => (
	<Router history={history}>
		<Switch>
			<PrivateRoute path="/" component={Timeline} exact={true} />
			<PrivateRoute path="/post/:postId" component={PostDetail} />
			<PublicRoute path="/login" component={LoginForm} />
			<PublicRoute path="/signup" component={SignupForm} />
		</Switch>
	</Router>
);

export default AppRouter;

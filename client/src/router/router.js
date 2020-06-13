import React from "react";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import Post from "../components/post";
import LoginForm from "../components/Login";

export const history = createHistory();

const AppRouter = (props) => (
	<Router history={history}>
		<Switch>
			<PrivateRoute path="/" component={Post} exact={true} />
			<PublicRoute path="/login" component={LoginForm} />
		</Switch>
	</Router>
);

export default AppRouter;

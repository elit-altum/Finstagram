import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import PrivateRoute from "./PrivateRoute";

import Post from "../components/post";
import LoginForm from "../components/Login";

export const history = createHistory();

const AppRouter = (props) => (
	<Router history={history}>
		<Switch>
			<PrivateRoute path="/" component={Post} exact={true} />
			<Route path="/login" component={LoginForm} exact={true} />
		</Switch>
	</Router>
);

export default AppRouter;

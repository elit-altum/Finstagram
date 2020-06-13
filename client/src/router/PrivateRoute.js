import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, Route } from "react-router-dom";

import Layout from "../components/Layout";
import Header from "../components/Header";

let renderCounter = 0;
let user = {};

const PrivateRoute = ({ component: Component, ...rest }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		axios
			.get("/api/v1/users/isLoggedIn")
			.then((res) => {
				renderCounter++;
				user = res.data.data.user;
				return setIsAuthenticated(true);
			})
			.catch((err) => {
				renderCounter++;
				console.log(err.response);
				return setIsAuthenticated(false);
			});
	}, []);

	console.log(user, isAuthenticated);

	return (
		<Route
			{...rest}
			component={(props) =>
				isAuthenticated ? (
					<>
						<Header user={user} />
						<Layout>
							<Component {...props} />
						</Layout>
					</>
				) : (
					!!renderCounter && <Redirect to="/login" />
				)
			}
		/>
	);
};

export default PrivateRoute;

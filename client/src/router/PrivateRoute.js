import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, Route } from "react-router-dom";
import { history } from "./router";

import Layout from "../components/Layout";
import Header from "../components/Header";

let renderCounter = 0;
let user = {};

const PrivateRoute = ({ component: Component, ...rest }) => {
	const [isAuthenticated, setIsAuthenticated] = useState();

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
				// console.log(err.response.status === 401);
				if (err.response.status === 401) {
					return setIsAuthenticated(false);
				}
			});
	}, []);

	return (
		<Route
			{...rest}
			component={(props) =>
				isAuthenticated ? (
					<>
						<Header user={user} />
						<Layout>
							<Component {...props} user={user} />
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

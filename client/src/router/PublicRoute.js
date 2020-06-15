import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, Route } from "react-router-dom";

import Layout from "../components/Layout";

let renderCounter = 0;

const PrivateRoute = ({ component: Component, ...rest }) => {
	const [isAuthenticated, setIsAuthenticated] = useState();

	useEffect(() => {
		axios
			.get("/api/v1/users/isLoggedIn")
			.then(() => {
				renderCounter++;
				return setIsAuthenticated(true);
			})
			.catch((err) => {
				renderCounter++;
				if (err.response.status === 401) {
					return setIsAuthenticated(false);
				}
			});
	}, []);

	return (
		<Route
			{...rest}
			component={(props) =>
				!isAuthenticated
					? !!renderCounter && (
							<Layout>
								<Component {...props} />
							</Layout>
					  )
					: !!renderCounter && <Redirect to="/" />
			}
		/>
	);
};

export default PrivateRoute;

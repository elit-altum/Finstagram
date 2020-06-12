import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, Route } from "react-router-dom";

import Layout from "../components/Layout";

const PrivateRoute = ({ component: Component, ...rest }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(true);

	const fetchData = async () => {
		try {
			const res = await axios({
				url: "/api/v1/users/isLoggedIn",
				method: "GET",
			});

			setIsAuthenticated(true);
		} catch (err) {
			setIsAuthenticated(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Route
			{...rest}
			component={(props) =>
				!isAuthenticated ? (
					<Layout>
						<Component {...props} />
					</Layout>
				) : (
					<Redirect to="/" />
				)
			}
		/>
	);
};

export default PrivateRoute;

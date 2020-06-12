import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, Route } from "react-router-dom";

import Layout from "../components/Layout";

const PrivateRoute = ({ component: Component, ...rest }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const fetchData = async () => {
		try {
			const res = await axios({
				url: "/api/v1/users/isLoggedIn",
				method: "GET",
			});

			setIsAuthenticated(true);
		} catch (err) {}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Route
			{...rest}
			component={(props) =>
				isAuthenticated ? (
					<Layout>
						<Component {...props} />
					</Layout>
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

export default PrivateRoute;

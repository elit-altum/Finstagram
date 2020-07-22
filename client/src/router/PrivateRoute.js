import React from "react";
import { Redirect, Route } from "react-router-dom";

import { connect } from "react-redux";

import Layout from "../components/Layout";
import Header from "../components/Header";

const PrivateRoute = ({ component: Component, user, loading, ...rest }) => {
	return (
		<Route
			{...rest}
			component={(props) =>
				!loading && user ? (
					<>
						<Header />
						<Layout>
							<Component {...props} user={user} />
						</Layout>
					</>
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	loading: state.auth.loading,
});

export default connect(mapStateToProps, null)(PrivateRoute);

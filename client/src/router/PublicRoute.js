import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

import Layout from "../components/Layout";

const PrivateRoute = ({ component: Component, user, loading, ...rest }) => {
	return (
		<Route
			{...rest}
			component={(props) =>
				!user && !loading ? (
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

const mapStateToProps = (state) => ({
	user: state.auth.user,
	loading: state.auth.loading,
});

export default connect(mapStateToProps, null)(PrivateRoute);

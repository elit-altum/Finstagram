import React from "react";
import { history } from "../router/router";

const PageNotFound = () => {
	return (
		<div className="page-404">
			<div className="page-404-content">
				<h3>Page Not Found</h3>
				<div className="content">
					<h2>404 Error</h2>
					<p>This page does not seem to exist :(</p>
					<button onClick={() => history.push("/")}>Home</button>
				</div>
			</div>
		</div>
	);
};

export default PageNotFound;

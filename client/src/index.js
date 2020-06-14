import React from "react";
import ReactDOM from "react-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRouter from "./router/router";

import "./styles/index.scss";

const jsx = (
	<div>
		<ToastContainer
			position="top-right"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={true}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
		/>
		<AppRouter />
	</div>
);

ReactDOM.render(jsx, document.getElementById("root"));

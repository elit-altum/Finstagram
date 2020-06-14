import React from "react";
import axios from "axios";

import { toast } from "react-toastify";

const LoginForm = () => {
	const sendFormData = async (e) => {
		e.preventDefault();
		const username = document.getElementById("username_field").value;
		const password = document.getElementById("password_field").value;

		try {
			await axios({
				url: "/api/v1/users/login",
				method: "POST",
				data: {
					username,
					password,
				},
			});
			toast.success("Logged in successfully!", {
				autoClose: 2000,
			});
			setTimeout(() => {
				window.location.reload(true);
			}, 2000);
		} catch (err) {
			console.log(err.response.data.data.error.message);
			toast.error(`Error: ${err.response.data.data.error.message}`);
		}
	};
	return (
		<div className="login-page">
			<div className="login-form-container">
				<h2>Finstagram</h2>
				<form onSubmit={sendFormData} class="login-form">
					<input
						type="text"
						name="username"
						required={true}
						placeholder="username"
						id="username_field"
					></input>
					<input
						type="password"
						name="password"
						placeholder="********"
						id="password_field"
						required={true}
					></input>
					<button type="submit" class="login-form__submit">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;

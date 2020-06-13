import React from "react";
import axios from "axios";

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
		} catch (err) {}
	};
	return (
		<div className="login-form">
			<form onSubmit={sendFormData}>
				<label>Username</label>
				<input
					type="text"
					name="username"
					required={true}
					placeholder="username"
					id="username_field"
				></input>
				<label>Password</label>
				<input
					type="password"
					name="password"
					placeholder="********"
					id="password_field"
					required={true}
				></input>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default LoginForm;

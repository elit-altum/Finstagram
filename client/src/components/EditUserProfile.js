import React, { useState } from "react";
import axios from "axios";

import { MdModeEdit as EditIcon } from "react-icons/md";

import { toast } from "react-toastify";

import { history } from "../router/router";
import Loader from "./Loader";

const EditUserProfile = ({ user }) => {
	const [uploadedText, setUploadedText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const sendUpdateData = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const form = new FormData();
		form.append("photo", document.getElementById("photo_field").files[0]);
		form.append("username", document.getElementById("username_field").value);
		form.append("email", document.getElementById("email_field").value);
		form.append("name", document.getElementById("name_field").value);

		try {
			await axios({
				url: "/api/v1/users/updateMe",
				method: "PATCH",
				data: form,
			});
			setIsLoading(false);

			toast.success("User details updated!", {
				autoClose: 2000,
			});
			setTimeout(() => {
				window.location.reload(true);
			}, 2000);
		} catch (err) {
			// console.log(err.response);
			setIsLoading(false);
			toast.error(`Error: ${err.response.data.data.error.message}`);
		}
	};

	const sendPasswordData = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const oldPassword = document.getElementById("oldPassword_field").value;
		const newPassword = document.getElementById("newPassword_field").value;
		const confirmPassword = document.getElementById("passwordConfirm_field")
			.value;

		try {
			await axios({
				url: "/api/v1/users/updatePassword",
				method: "PATCH",
				data: {
					oldPassword,
					newPassword,
					confirmPassword,
				},
			});

			toast.success("Password successfully updated!", {
				autoClose: 2000,
			});
			setTimeout(() => {
				window.location.reload(true);
			}, 2000);
		} catch (err) {
			// console.log(err.response);
			setIsLoading(false);
			toast.error(`Error: ${err.response.data.data.error.message}`);
		}
	};

	return (
		<>
			<div className="login-page">
				<div className="login-form-container">
					<h2>Update Profile</h2>
					<form onSubmit={sendUpdateData} className="login-form">
						<div className="edit-image">
							<p>{uploadedText}</p>
							<img src={user.photo} alt={`${user.name}'s profile`} />
							<label
								htmlFor="photo_field"
								className="upload-profile-label"
								title="Change Profile Picture"
							>
								<EditIcon />
							</label>
						</div>
						<label className="edit-user-label">Username</label>
						<input
							type="text"
							name="username"
							required={true}
							placeholder="Username"
							id="username_field"
							defaultValue={user.username}
							className="edit-user-input"
						></input>
						<label className="edit-user-label">Name</label>
						<input
							type="text"
							name="name"
							required={true}
							placeholder="Name"
							id="name_field"
							defaultValue={user.name}
							className="edit-user-input"
						></input>
						<label className="edit-user-label">Email</label>
						<input
							type="email"
							name="email"
							required={true}
							placeholder="Email Address"
							id="email_field"
							defaultValue={user.email}
							className="edit-user-input"
						></input>
						<input
							type="file"
							name="photo"
							accept="image/*"
							placeholder="Photo"
							id="photo_field"
							onChange={() => setUploadedText("New profile uploaded!")}
						></input>
						<button
							type="submit"
							className="login-form__submit"
							disabled={isLoading}
						>
							{!isLoading ? <p>Submit</p> : <Loader />}
						</button>
					</form>
				</div>
			</div>
			<div className="login-page" style={{ marginTop: "-80px" }}>
				<div className="login-form-container">
					<h2>ChangePassword</h2>
					<form onSubmit={sendPasswordData} className="login-form">
						<label className="edit-user-label">Current Password</label>
						<input
							type="password"
							name="oldPassword"
							placeholder="********"
							id="oldPassword_field"
							required={true}
							className="edit-user-input"
						></input>
						<label className="edit-user-label">New Password</label>
						<input
							type="Password"
							name="newPassword"
							placeholder="********"
							id="newPassword_field"
							required={true}
							className="edit-user-input"
						></input>
						<label className="edit-user-label">Confirm Password</label>
						<input
							type="password"
							name="passwordConfirm"
							placeholder="********"
							id="passwordConfirm_field"
							required={true}
							className="edit-user-input"
						></input>
						<button type="submit" className="login-form__submit">
							{!isLoading ? <p>Update</p> : <Loader />}
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default EditUserProfile;

import React from "react";
import axios from "axios";

import { AiFillFileAdd as AddFile } from "react-icons";

import { toast } from "react-toastify";

import { history } from "../router/router";

const CreatePost = () => {
	const sendFormData = async (e) => {
		e.preventDefault();

		const form = new FormData();
		form.append("photo", document.getElementById("photo_field").files[0]);
		form.append("caption", document.getElementById("caption_field").value);

		try {
			await axios({
				url: "/api/v1/posts/create",
				method: "POST",
				data: form,
			});

			toast.success("New post created!", {
				autoClose: 2000,
			});
			setTimeout(() => {
				history.push("/");
			}, 2000);
		} catch (err) {
			console.log(err.response.data.data.error.message);
			toast.error(`Error: ${err.response.data.data.error.message}`);
		}
	};
	return (
		<div className="login-page">
			<div className="login-form-container">
				<h2>New Post</h2>
				<form onSubmit={sendFormData} class="login-form">
					<input
						type="text"
						name="caption"
						placeholder="Caption"
						id="caption_field"
					></input>
					<input
						type="file"
						name="photo"
						accept="image/*"
						required={true}
						placeholder="Photo"
						id="photo_field"
					></input>
					<label for="photo_field">Choose</label>
					<button type="submit" className="login-form__submit">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreatePost;

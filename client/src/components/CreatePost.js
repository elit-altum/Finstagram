import React, { useState } from "react";
import axios from "axios";

import {
	BsFileEarmarkPlus as AddFileIcon,
	BsFileEarmarkCheck as UploadedFileIcon,
} from "react-icons/bs";

import { toast } from "react-toastify";

import { history } from "../router/router";
import Loader from "./Loader";

const CreatePost = () => {
	const [uploaded, setUploaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const sendFormData = async (e) => {
		setIsLoading(true);
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

			toast.success("New post created! Redirecting..", {
				autoClose: 2000,
			});
			setTimeout(() => {
				history.push("/");
			}, 2000);
		} catch (err) {
			setIsLoading(false);
			toast.error(`Error: ${err.response.data.data.error.message}`);
		}
	};
	return (
		<div className="login-page">
			<div className="login-form-container">
				<h2>New Post</h2>
				<form onSubmit={sendFormData} className="login-form">
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
						onChange={() => setUploaded(true)}
					></input>
					<label htmlFor="photo_field" className="upload-post-label">
						{!uploaded ? (
							<>
								<AddFileIcon />
								<p>Add Image</p>
							</>
						) : (
							<>
								<UploadedFileIcon />
								<p>Uploaded!</p>
							</>
						)}
					</label>
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
	);
};

export default CreatePost;

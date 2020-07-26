import React, { useState } from "react";
import axios from "axios";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import geoCode from "../utils/geoCode";

import { connect } from "react-redux";

import {
	BsFileEarmarkPlus as AddFileIcon,
	BsFileEarmarkCheck as UploadedFileIcon,
} from "react-icons/bs";

import { toast } from "react-toastify";

import { history } from "../router/router";
import Loader from "./Loader";

// Global object for sending location data
let globalLocation = {};

const CreatePost = ({ fetchPosts }) => {
	const [uploaded, setUploaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [locations, setLocations] = useState([]);
	const [locationLoading, setLocationLoading] = useState(false);
	const [isValidLocation, setIsValidLocation] = useState(true);

	// Display location search results
	const SearchResults = ({ locations }) => {
		// Select a search result & update global object
		const selectLocation = (location) => {
			document.getElementById("location_field").value = location.name;
			setIsValidLocation(true);
			setLocationLoading(true);
			globalLocation = {
				locationName: location.name,
				latitude: location.latitude,
				longitude: location.longitude,
			};
		};

		// Search result component
		return (
			<div className="locationSearch-results">
				{locations.map((location) => (
					<div
						className="searchLocation"
						key={location.name}
						onClick={() => selectLocation(location)}
					>
						<p>{location.name}</p>
					</div>
				))}
			</div>
		);
	};

	// Send post to backend
	const sendFormData = async (e) => {
		setIsLoading(true);
		e.preventDefault();

		const form = new FormData();
		form.append("photo", document.getElementById("photo_field").files[0]);
		form.append("caption", document.getElementById("caption_field").value);

		// Only add these if user has selected a valid location
		if (isValidLocation && globalLocation.hasOwnProperty("locationName")) {
			form.append("locationName", globalLocation.locationName);
			form.append("latitude", globalLocation.latitude);
			form.append("longitude", globalLocation.longitude);
		}

		// Send post data to backend & create post
		try {
			const res = await axios({
				url: "/api/v1/posts/create",
				method: "POST",
				data: form,
			});

			toast.success("New post created! Redirecting..", {
				autoClose: 2000,
			});
			fetchPosts();
			setTimeout(() => {
				history.push("/");
			}, 2000);
		} catch (err) {
			setIsLoading(false);
			toast.error(`Error: ${err.response.data.data.error.message}`);
		}
	};

	const asyncFunctionDebounced = AwesomeDebouncePromise(geoCode, 500);

	// Use MapBox API to search for locations
	const searchLocation = async (e) => {
		e.preventDefault();
		setIsValidLocation(false);

		if (e.target.value) {
			setLocationLoading(true);
			e.persist();
			try {
				const mapBoxLocations = await asyncFunctionDebounced(e.target.value);
				if (e.target.value) {
					setLocations(mapBoxLocations);
				}
			} catch (e) {}
			setLocationLoading(false);
		} else {
			// If user clears his search
			setLocations([]);
			setIsValidLocation(true);
			globalLocation = {};
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
						type="text"
						name="location"
						placeholder="Location"
						id="location_field"
						autoComplete="off"
						onChange={searchLocation}
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
					<div className="searchResults">
						{!locationLoading && !!locations.length && (
							<SearchResults locations={locations} />
						)}
					</div>
					{!isValidLocation && (
						<p>
							*Please only select a valid location. Invalid locations will be
							rejected.
						</p>
					)}
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

const mapDispatchToProps = (dispatch) => ({
	fetchPosts: () => dispatch({ type: "FETCH_TIMELINE" }),
});

export default connect(null, mapDispatchToProps)(CreatePost);

import axios from "axios";

// ? 01. CHECK IF USER IS AUTHENTICATED
export function isLoggedIn() {
	return axios.get("/api/v1/users/isLoggedIn");
}

// ? 02. FETCH TIMELINE OF USER
export function getTimeline() {
	return axios.get("/api/v1/posts/feed");
}

// ? 03. FETCH TRENDING POSTS
export function getTrending() {
	return axios.get("/api/v1/posts/trending");
}

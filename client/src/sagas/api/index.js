import axios from "axios";

// ? 01. CHECK IF USER IS AUTHENTICATED
export function isLoggedIn() {
	return axios.get("/api/v1/users/isLoggedIn");
}

// ? 02. FETCH TIMELINE OF USER
export function getTimeline() {
	return axios.get("/api/v1/posts/feed");
}

// ? 03. FETCH TIMELINE PAGES OF USER
export function getTimelinePages(page) {
	return axios.get(`/api/v1/posts/feed?page=${page}`);
}

// ? 04. FETCH TRENDING POSTS
export function getTrending() {
	return axios.get("/api/v1/posts/trending");
}

// ? 05. FETCH NOTIFICATIONS
export function getNotifications() {
	return axios.get("/api/v1/users/notifications");
}

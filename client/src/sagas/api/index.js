import axios from "axios";

// ? 01. CHECK IF USER IS LOGGED IN
export function isLoggedIn() {
	return axios.get("/api/v1/users/isLoggedIn");
}

// ? 02. LOGOUT USER
export function logoutUser() {
	return axios.get("/api/v1/users/logout");
}

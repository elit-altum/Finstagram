export const getAuthToken = () => ({
	type: "FETCH_AUTH_TOKEN",
});

export const fetchMyTimeline = () => ({
	type: "FETCH_TIMELINE",
});

export const fetchTrendingPosts = () => ({
	type: "FETCH_TRENDING",
});

export const fetchNotifications = () => ({
	type: "FETCH_NOTIFICATIONS",
});
export const checkNotifications = () => ({
	type: "CHECK_NOTIFICATIONS",
});

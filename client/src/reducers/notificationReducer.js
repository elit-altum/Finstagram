const reducer = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_NOTIFICATIONS":
			return { ...state, loading: true };
		case "CHECK_NOTIFICATIONS":
			return { ...state };
		case "PUT_NOTIFICATIONS":
			return { ...state, notifications: action.notifications, loading: false };
		default:
			return state;
	}
};

export default reducer;

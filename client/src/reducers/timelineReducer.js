const reducer = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_TIMELINE":
			return { ...state, loading: true };
		case "PUT_TIMELINE":
			return { ...state, posts: action.posts, loading: false };
		case "CLEAR_TIMELINE":
			return { ...state, posts: [], loading: false };
		default:
			return state;
	}
};

export default reducer;

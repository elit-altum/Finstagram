const reducer = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_POSTS":
			return { ...state, loading: true };
		case "PUT_POSTS":
			return { ...state, posts: action.posts, loading: false };
		default:
			return state;
	}
};

export default reducer;

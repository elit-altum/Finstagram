const reducer = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_TRENDING":
			return { ...state, loading: true };
		case "PUT_TRENDING":
			return { ...state, posts: action.posts, loading: false };
		default:
			return state;
	}
};

export default reducer;

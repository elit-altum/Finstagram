const reducer = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_TIMELINE":
			return { ...state, loading: true, end: false };
		case "PUT_TIMELINE":
			return {
				...state,
				posts: action.posts,
				loading: false,
				page: 1,
				end: false,
			};
		case "PUT_TIMELINE_ON_CHANGE":
			return {
				...state,
				posts: action.posts,
			};
		case "PUT_TIMELINE_SCROLL":
			const newPosts = state.posts.concat(action.posts);
			const newPage = state.page + 1;
			return { ...state, posts: newPosts, page: newPage, end: false };
		case "END_OF_TIMELINE":
			return { ...state, end: true };
		case "CLEAR_TIMELINE":
			return { ...state, posts: [], loading: false, end: false };
		default:
			return state;
	}
};

export default reducer;

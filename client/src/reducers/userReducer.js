const reducer = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_USER":
			return { ...state, loading: true };
		case "PUT_USER":
			return {
				...state,
				user: action.user,
				follows: action.follows,
				followers: action.followers,
				loading: false,
			};
		default:
			return state;
	}
};

export default reducer;

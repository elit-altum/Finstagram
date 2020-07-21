const initialState = {
	loading: true,
	user: false,
};

const reducer = (state = initialState, action) => {
	console.log(action);
	switch (action.type) {
		case "FETCH_AUTH_TOKEN":
			return { ...state, loading: true };
		case "PUT_TOKEN":
			return { ...state, user: action.user, loading: false };
		case "LOGOUT_USER":
			return { ...state, user: "", loading: false };
		default:
			return state;
	}
};

export default reducer;

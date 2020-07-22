const initialState = {
	loading: true,
	user: false,
};

const reducer = (state = initialState, action) => {
	console.log(action, state);
	switch (action.type) {
		case "FETCH_AUTH_TOKEN":
			return { ...state, loading: true };
		case "PUT_TOKEN":
			return { ...state, user: action.user, loading: false };
		case "USER_NOT_FOUND":
			return { ...state, user: false, loading: false };
		default:
			return state;
	}
};

export default reducer;

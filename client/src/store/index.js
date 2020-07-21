// Configuring redux and redux-saga for global state management
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import authReducer from "../reducers/authReducer";
import userReducer from "../reducers/userReducer";
import timelineReducer from "../reducers/timelineReducer";

import mySaga from "../sagas";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Mount it on the Store
const store = createStore(
	combineReducers({
		auth: authReducer,
		user: userReducer,
		timeline: timelineReducer,
	}),
	composeEnhancers(applyMiddleware(sagaMiddleware))
);

export default store;

// Run the saga
sagaMiddleware.run(mySaga);

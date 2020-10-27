// Configuring redux and redux-saga for global state management
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import authReducer from "../reducers/authReducer";
import trendingReducer from "../reducers/trendingReducer";
import timelineReducer from "../reducers/timelineReducer";
import notificationReducer from "../reducers/notificationReducer";

import mySaga from "../sagas";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
	process.env.NODE_ENV === "development"
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
		: compose;

// Mount it on the Store
const store = createStore(
	combineReducers({
		auth: authReducer,
		trending: trendingReducer,
		timeline: timelineReducer,
		notifications: notificationReducer,
	}),
	composeEnhancers(applyMiddleware(sagaMiddleware))
);

export default store;

// Run the saga
sagaMiddleware.run(mySaga);

import { put, takeLatest, all, call } from "redux-saga/effects";
import * as api from "./api";

// ? 01. GET USER TOKEN
function* fetchAuthToken() {
	try {
		const res = yield call(api.isLoggedIn);
		yield put({ type: "PUT_TOKEN", user: res.data.data.user });
	} catch (e) {
		yield put({ type: "USER_NOT_FOUND" });
	}
}

// ? 02. GET USER TIMELINE
function* fetchTimeline() {
	try {
		const res = yield call(api.getTimeline);
		yield put({ type: "PUT_TIMELINE", posts: res.data.data.posts });
	} catch (e) {}
}

// ? 03. GET TRENDING POSTS
function* fetchTrending() {
	try {
		const res = yield call(api.getTrending);
		yield put({ type: "PUT_TRENDING", posts: res.data.data.posts });
	} catch (e) {}
}

function* actionWatcher() {
	yield takeLatest("FETCH_AUTH_TOKEN", fetchAuthToken);
	yield takeLatest("FETCH_TIMELINE", fetchTimeline);
	yield takeLatest("FETCH_TRENDING", fetchTrending);
}

export default function* rootSaga() {
	yield all([actionWatcher()]);
}

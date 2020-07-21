import { put, takeLatest, all, call } from "redux-saga/effects";
import * as api from "./api";
// Get User Token
function* fetchAuthToken() {
	try {
		const res = yield call(api.isLoggedIn);
		yield put({ type: "PUT_TOKEN", user: res.data.data.user });
	} catch (e) {}
}

function* actionWatcher() {
	yield takeLatest("FETCH_AUTH_TOKEN", fetchAuthToken);
}

export default function* rootSaga() {
	yield all([actionWatcher()]);
}

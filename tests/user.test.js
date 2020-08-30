// For testing user interactions
const request = require("supertest");
const app = require("../app");

const {
	setupUserCollection,
	userOne,
	userTwo,
	samplePost,
} = require("./fixtures/db");

beforeAll(setupUserCollection);

// 01. FOLLOW USERS
test("Should follow a user.", async () => {
	const res = await request(app)
		.get(`/api/v1/users/${userTwo.username}/follow`)
		.set("Authorization", `Bearer ${userOne.token}`)
		.expect(200);

	expect(res.body.message).toBe(`You now follow @${userTwo.username}`);
});

test("Should not follow already followed user.", async () => {
	await request(app)
		.get(`/api/v1/users/${userTwo.username}/follow`)
		.set("Authorization", `Bearer ${userOne.token}`)
		.expect(400);
});

// 02. FETCHING TIMELINE
test("Should fetch user timeline.", async () => {
	const res = await request(app)
		.get("/api/v1/posts/feed")
		.set("Authorization", `Bearer ${userOne.token}`)
		.expect(200);

	// Should have 2 posts in timeline
	// One created by self and one from followed user
	expect(res.body.results).toBe(2);
});

test("Should fetch nearby posts using coordinates.", async () => {
	const latitude = samplePost.location.coordinates[1];
	const longitude = samplePost.location.coordinates[0];

	// Send request
	const res = await request(app)
		.get(`/api/v1/posts/near?lat=${latitude}&lng=${longitude}`)
		.set("Authorization", `Bearer ${userOne.token}`)
		.expect(200);

	expect(res.body.data.location.latitude).toBe(latitude);
	expect(res.body.data.location.longitude).toBe(longitude);
	expect(res.body.data.posts.length).toBeGreaterThanOrEqual(2);
});

// 03.UNFOLLOW USERS
test("Should unfollow a followed user.", async () => {
	const res = await request(app)
		.get(`/api/v1/users/${userTwo.username}/unfollow`)
		.set("Authorization", `Bearer ${userOne.token}`)
		.expect(200);

	expect(res.body.message).toBe(`You unfollowed @${userTwo.username}`);
});

test("Should not unfollow a non-followed user.", async () => {
	await request(app)
		.get(`/api/v1/users/${userTwo.username}/unfollow`)
		.set("Authorization", `Bearer ${userOne.token}`)
		.expect(400);
});

// 04. FETCH USER POSTS
test("Should fetch personal user details.", async () => {
	const res = await request(app)
		.get(`/api/v1/users/user/${userOne.username}`)
		.set("Authorization", `Bearer ${userOne.token}`)
		.expect(200);

	expect(res.body.data.user.name).toBe(userOne.name);
	expect(res.body.data.user.username).toBe(userOne.username);
	expect(res.body.data.user.postsCount).toBe(1);
});

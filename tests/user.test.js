// For testing user interactions
const request = require("supertest");
const app = require("../app");

const { setupUserCollection, userOne, userTwo } = require("./fixtures/db");

beforeAll(setupUserCollection);

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

test("Should not unfollow a followed user.", async () => {
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

const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");

let { setupAuthCollection, newUser } = require("./fixtures/db");

// 00 a. CLEAR USER COLLECTION BEFORE RUNNING TESTS
beforeAll(setupAuthCollection);

// 01. SIGNUP USER
test("Should signup new user correctly.", async () => {
	const res = await request(app)
		.post("/api/v1/users/signup")
		.send(newUser)
		.expect(200);

	// Should issue JWT & cookie
	expect(res.body.data.token).not.toBeNull();
	expect(res.header["set-cookie"][0]).toMatch(/^jwt/);

	newUser.token = res.body.data.token;

	// Should create user on database
	const user = await User.findById(res.body.data.user.id);
	expect(user).not.toBeNull();
});

test("Should not signup duplicate user", async () => {
	await request(app).post("/api/v1/users/signup").send(newUser).expect(400);
});

test("Should not signup user without matching password.", async () => {
	await request(app)
		.post("/api/v1/users/signup")
		.send({
			...newUser,
			username: "jadey",
			email: "jadeY@gmail.com",
			passwordConfirm: "pass12345",
		})
		.expect(400);
});

test("Should not signup user with password < 8 characters", async () => {
	await request(app)
		.post("/api/v1/users/signup")
		.send({
			...newUser,
			username: "kenny",
			email: "ken@gmail.com",
			password: "pass",
			passwordConfirm: "pass",
		})
		.expect(400);
});

// 02. LOGIN USER
test("Should login existing user.", async () => {
	await request(app)
		.post("/api/v1/users/login")
		.send({
			username: newUser.username,
			password: newUser.password,
		})
		.expect(200);
});

test("Should not login user with wrong password.", async () => {
	await request(app)
		.post("/api/v1/users/login")
		.send({
			username: newUser.username,
			password: "pass",
		})
		.expect(400);
});

test("Should not login non-existent user.", async () => {
	await request(app)
		.post("/api/v1/users/login")
		.send({
			username: "randomUsername",
			password: newUser.password,
		})
		.expect(400);
});

// 03. UPDATE PASSWORD
test("Should update password.", async () => {
	const res = await request(app)
		.patch(`/api/v1/users/updatePassword`)
		.set("Authorization", `Bearer ${newUser.token}`)
		.send({
			oldPassword: newUser.password,
			newPassword: "pass1234",
			confirmPassword: "pass1234",
		})
		.expect(200);

	expect(res.body.message).toBe("Password changed successfully.");
});

test("Should not login user with old password.", async () => {
	const res = await request(app)
		.post("/api/v1/users/login")
		.send({
			username: newUser.username,
			password: newUser.password,
		})
		.expect(400);

	expect(res.body.data.error.message).toBe("Invalid username or password.");
});

test("Should login user with updated password.", async () => {
	const res = await request(app)
		.post("/api/v1/users/login")
		.send({
			username: newUser.username,
			password: "pass1234",
		})
		.expect(200);

	expect(res.body.data.token).not.toBeNull();
	newUser.token = res.body.data.token;
});

// 04. UPDATE NON-SENSITIVE USER DETAILS
test("Should update user's name", async () => {
	const res = await request(app)
		.patch(`/api/v1/users/updateMe`)
		.set("Authorization", `Bearer ${newUser.token}`)
		.field("name", "New Name")
		.expect(200);

	expect(res.body.data.user.name).toBe("New Name");
});

test("Should update user's username", async () => {
	const res = await request(app)
		.patch(`/api/v1/users/updateMe`)
		.set("Authorization", `Bearer ${newUser.token}`)
		.field("username", "new_username_unique")
		.expect(200);

	expect(res.body.data.user.username).toBe("new_username_unique");
});

// 05. LOGOUT USER
test("Should logout user from session.", async () => {
	const res = await request(app)
		.get("/api/v1/users/logout")
		.set("Authorization", `Bearer ${newUser.token}`)
		.send()
		.expect(200);

	// Should return cookie
	expect(res.header["set-cookie"][0]).toMatch(/^jwt=loggedOut;/);
});

// 06. SESSION VALIDATION
test("Should indicate user is logged in, with token.", async () => {
	await request(app)
		.get("/api/v1/users/isLoggedIn")
		.set("Authorization", `Bearer ${newUser.token}`)
		.send()
		.expect(200);
});

test("Should indicate user is logged out, without token.", async () => {
	await request(app).get("/api/v1/users/isLoggedIn").send().expect(401);
});

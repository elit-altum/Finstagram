const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");

// 00 a. CLEAR USER COLLECTION BEFORE RUNNING TESTS
beforeAll(async () => {
	await User.deleteMany();
});

// 00 b. SAMPLE USER FOR TESTS
const sampleUser = {
	name: "John Flank",
	username: "john_1",
	email: "john_flank@gmail.com",
	password: "pass1234",
	passwordConfirm: "pass1234",
};

// 01. SIGNUP USER TESTS
test("Should signup user correctly.", async () => {
	await request(app).post("/api/v1/users/signup").send(sampleUser).expect(200);
});

test("Should not signup duplicate user", async () => {
	await request(app).post("/api/v1/users/signup").send(sampleUser).expect(400);
});

test("Should not signup user without matching password.", async () => {
	await request(app)
		.post("/api/v1/users/signup")
		.send({
			...sampleUser,
			username: "john_2",
			email: "john_2@gmail.com",
			passwordConfirm: "pass12345",
		})
		.expect(400);
});

test("Should not signup user with password < 8 characters", async () => {
	await request(app)
		.post("/api/v1/users/signup")
		.send({
			...sampleUser,
			username: "john_3",
			email: "john_3@gmail.com",
			password: "pass",
			passwordConfirm: "pass",
		})
		.expect(400);
});

// 02. LOGIN USER TESTS
test("Should login existing user.", async () => {
	await request(app)
		.post("/api/v1/users/login")
		.send({
			username: sampleUser.username,
			password: sampleUser.password,
		})
		.expect(200);
});

test("Should not login user with wrong password.", async () => {
	await request(app)
		.post("/api/v1/users/login")
		.send({
			username: sampleUser.username,
			password: "pass",
		})
		.expect(400);
});

test("Should not login non-existent user.", async () => {
	await request(app)
		.post("/api/v1/users/login")
		.send({
			username: "randomUsername",
			password: sampleUser.password,
		})
		.expect(400);
});

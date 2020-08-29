const request = require("supertest");
const app = require("../app");
const cloudinary = require("cloudinary").v2;

const { setupPostCollection, postUser } = require("./fixtures/db");

let postPublicId;
let postId;

beforeAll(setupPostCollection);

test("Should create a new post.", async () => {
	// Increased timeout as test may take long while communicating with cloudinary API
	jest.setTimeout(12000);

	const res = await request(app)
		.post("/api/v1/posts/create")
		.set("Authorization", `Bearer ${postUser.token}`)
		.attach("photo", "tests/fixtures/data/sample-post.jpg")
		.field("caption", "Some caption")
		.field("locationName", "DLF Cyber City")
		.field("latitude", 28.4940474)
		.field("longitude", 77.0864596)
		.expect(201);

	// Should create caption for post
	expect(res.body.data.post.caption).toBe("Some caption");

	// Should get a cloudinary url for post
	expect(res.body.data.post.photo).toMatch(/^http:\/\/res.cloudinary.com/);

	postPublicId = res.body.data.public_id;
	postId = res.body.data.post._id;
});

test("Should update post caption.", async () => {
	const res = await request(app)
		.patch(`/api/v1/posts/edit/${postId}`)
		.set("Authorization", `Bearer ${postUser.token}`)
		.send({
			caption: "New Caption",
		})
		.expect(200);

	// Should update the caption
	expect(res.body.data.post.caption).toBe("New Caption");
});

afterAll(async () => {
	// Clear the uploaded image on cloudinary
	await cloudinary.uploader.destroy(postPublicId);
});

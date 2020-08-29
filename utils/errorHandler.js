// Handles express errors

const handleMongoErrors = (err) => {
	const value = Object.keys(err.keyValue)[0];
	err.message = `This ${value} already exists. Please try again.`;
};

const handlePasswordError = (err) => {
	try {
		const newMessage = err.message.split(": ")[2].split(",")[0];
		err.message = newMessage;
	} catch (err) {}
};

const handleJWTError = (err) => {
	err.message = "This session is invalid. Please login again.";
};

module.exports = (err, req, res, next) => {
	let statusCode = err.statusCode || 400;
	let status =
		err.statusCode || statusCode.toString().startsWith("4")
			? "error"
			: "failure";

	if (err.code === 11000) {
		handleMongoErrors(err);
	}

	if (
		err.message.includes("password") ||
		err.message.includes("passwordConfirm")
	) {
		handlePasswordError(err);
	}

	if (err.name === "JsonWebTokenError") {
		handleJWTError(err);
	}
	if (
		process.env.NODE_ENV === "development" ||
		process.env.NODE_ENV === "test"
	) {
		// console.log(err.message);
		// console.log(err);
		return res.status(statusCode).json({
			status,
			data: {
				error: {
					message: err.message,
					...err,
				},
			},
		});
	} else {
		return res.status(statusCode).json({
			status,
			data: {
				error: {
					message: err.message,
				},
			},
		});
	}
};

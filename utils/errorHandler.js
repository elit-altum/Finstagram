// Handles express errors
module.exports = (err, req, res, next) => {
	let statusCode = err.statusCode || 400;
	let status =
		err.statusCode || statusCode.toString().startsWith("4")
			? "error"
			: "failure";
	if (process.env.NODE_ENV === "development") {
		return res.status(statusCode).json({
			status: status,
			data: {
				error: {
					message: err.message,
					...err,
				},
			},
		});
	}
};

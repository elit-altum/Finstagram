// Custom errors for express apps
class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode || 500;
		this.status = this.statusCode.toString().startsWith("4")
			? "error"
			: "failure";

		this.isOperational = true;
	}
}

module.exports = AppError;

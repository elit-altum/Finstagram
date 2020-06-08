// Async function wrapper for error handling instead of try-catch blocks

module.exports = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch((err) => next(err));
	};
};

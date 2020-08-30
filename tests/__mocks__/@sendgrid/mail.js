module.exports = {
	setApiKey() {},
	send(value, err) {
		return new Promise((resolve, reject) => {
			if (err) {
				reject();
			} else {
				resolve();
			}
		});
	},
};

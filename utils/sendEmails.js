// Send emails using SendGrid

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = ({ to, subject, html }) => {
	const msg = {
		to,
		from: process.env.SENDGRID_SENDER_EMAIL,
		subject,
		html,
	};
	sgMail.send(msg).catch((err) => console.log(err.response.body));
};

module.exports = sendEmail;

const sg = require('@sendgrid/mail');

sg.setApiKey(process.env.SENDGRID_API_KEY);

const forgotPasswordEmail = async (userEmail, tempPassword) => {
    const response = await sg.send({
        to: userEmail,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'Please reset your password',
        text: `Hello. This is from WooJoo Market. Your temporary password is now set to ${tempPassword}. Please log in and reset your password as soon as possible. Thanks. - WooJoo Market Admin`
    });
    return response;
};

module.exports = forgotPasswordEmail;

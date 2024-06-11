const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

exports.sendNewsEmail = async (to, subject, text, imageUrl) => {
    const htmlContent = `
        <div>
            <p>${text}</p>
            <img src="${imageUrl}" alt="Imagen de la noticia" style="max-width: 100%; height: auto;">
        </div>
    `;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

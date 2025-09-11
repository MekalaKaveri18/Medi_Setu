const transporter = require('../config/mailer');

const sendEmail = async (to, subject, htmlBody, qrBase64) => {
  try {
    const base64Data = qrBase64.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64Data, 'base64');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlBody + `<br><br><img src="${qrBase64}" alt="QR Code" />`,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrBuffer,
          contentType: 'image/png'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;

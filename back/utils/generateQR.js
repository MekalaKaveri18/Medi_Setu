const QRCode = require('qrcode');

// Accepts any text (usually transaction info), returns a base64 QR code
const generateQR = async (text) => {
  try {
    const qrImage = await QRCode.toDataURL(text);
    return qrImage;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};

module.exports = generateQR;

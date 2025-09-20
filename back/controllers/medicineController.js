const {
  addMedicine,
  getMedicineById // ✅ correct name — don’t alias it to something else
} = require('../models/medicineModel');


const generateQR = require('../utils/generateQR');
const sendEmail = require('../utils/sendEmail');
const pool = require('../config/db');

// 📦 Add new medicine (Lender Form)
const addMedicineController = async (req, res) => {
  const {
    fullName, location, medicineName, quantity,
    expiryDate, peraWallet, mode,
    cost, contact, description
  } = req.body;

  if (!fullName || !location || !medicineName || !quantity || !expiryDate || !peraWallet || !contact || !mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const donateOrLend = mode.toLowerCase(); // 'donate' or 'lend'
    const finalCost = donateOrLend === 'lend' ? cost : null;

    console.log('🟢 Adding medicine:', req.body);

    await addMedicine(
      fullName,
      location,
      medicineName,
      quantity,
      expiryDate,
      peraWallet,
      donateOrLend,
      finalCost,
      contact,
      description
    );

    res.status(201).json({ message: "Medicine added successfully!" });
  } catch (error) {
    console.error('❌ Error in adding medicine:', error);
    res.status(500).json({ error: 'Failed to add medicine' });
  }
};

// 📋 Get all available medicines
const getAvailableMedicines = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medicines WHERE quantity > 0');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching medicines:', err);
    res.status(500).json({ message: 'Failed to fetch medicines' });
  }
};

// 🔍 Get medicine by ID
const getMedicineDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const medicine = await getMedicineById(id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.status(200).json(medicine);
  } catch (error) {
    console.error('❌ Error fetching medicine by ID:', error);
    res.status(500).json({ error: 'Failed to fetch medicine' });
  }
};

// 📨 Borrow medicine → generate QR & email
const requestMedicine = async (req, res) => {
  const { borrowerEmail, medicineId } = req.body;
  console.log('📨 Received borrow request:', { borrowerEmail, medicineId });

  if (!borrowerEmail || !medicineId) {
    return res.status(400).json({ error: 'Missing borrower email or medicine ID' });
  }
  try {
    const medicine = await getMedicineById(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    console.log('❓ Medicine found:', medicine);
  
    const lenderPeraWallet = medicine.pera_wallet;
  
    const lenderQuery = await pool.query(
      'SELECT email FROM users WHERE pera_wallet = $1',
      [lenderPeraWallet]
    );
  
    if (lenderQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Lender not found for this medicine' });
    }
  
    const lenderEmail = lenderQuery.rows[0].email;
    console.log('📧 Lender email resolved:', lenderEmail);
    console.log('📤 Sending email to:', [borrowerEmail, lenderEmail]);
  
    const qrData = {
      medicine: medicine.medicine_name,
      quantity: medicine.quantity,
      lender: medicine.lender_name,
      borrowerEmail,
      time: new Date().toISOString()
    };
  
    const qrImage = await generateQR(JSON.stringify(qrData));
  
    const emailBody = `...`; // your email HTML
  
    await sendEmail(
      [borrowerEmail, lenderEmail],
      '📦 Medicine Borrow Request - MediSetu',
      emailBody,
      qrImage
    );
  
    console.log('✅ Email sent to:', [borrowerEmail, lenderEmail]);
  
    res.status(200).json({ message: 'QR Code sent to both borrower and lender emails' });
  } catch (error) {
    console.error('❌ Error processing medicine request:', error);
    res.status(500).json({ error: 'Failed to request medicine' });
  }
}

// ✅ Export all controllers
module.exports = {
  addMedicine: addMedicineController,
  getAvailableMedicines,
  getMedicineDetails,
  requestMedicine
};

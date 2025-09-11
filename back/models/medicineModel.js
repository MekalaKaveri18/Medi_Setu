const pool = require('../config/db');

// 📦 Add new medicine with error handling
const addMedicine = async (
  fullName, location, medicineName, quantity,
  expiryDate, peraWallet, donateOrLend,
  cost, contact, description
) => {
  const query = `
    INSERT INTO medicines (
      lender_name, location, medicine_name, quantity,
      expiry_date, pera_wallet, donate_or_lend,
      cost, contact, description
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    fullName, location, medicineName, quantity,
    expiryDate, peraWallet, donateOrLend,
    cost, contact, description
  ];

  try {
    console.log('Inserting medicine values:', values);
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    console.error('DB Error in addMedicine:', err);
    throw err;
  }
};

// ✅ Add this function to fetch medicine by ID
const getMedicineById = async (medicineId) => {
  try {
    const result = await pool.query('SELECT * FROM medicines WHERE id = $1', [medicineId]);
    return result.rows[0];
  } catch (err) {
    console.error('DB Error in getMedicineById:', err);
    throw err;
  }
};

module.exports = {
  addMedicine,
  getMedicineById, // ✅ export it here too
};

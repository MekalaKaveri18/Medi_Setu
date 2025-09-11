const express = require('express');
const router = express.Router();

const {
  addMedicine,
  getAvailableMedicines,
  getMedicineDetails: getMedicineById,
  requestMedicine
} = require('../controllers/medicineController');

// Debug root route to test API
router.get("/", (req, res) => {
  res.send("MediSetu Medicine API is working!");
});

// Route to add a new medicine (Lender form submission)
router.post('/add', addMedicine);

// Route to fetch all available medicines
router.get('/available', getAvailableMedicines);

// Route to fetch specific medicine details by ID
router.get('/:id', getMedicineById);

// Route to request a medicine (borrower)
router.post('/request', requestMedicine);

module.exports = router;

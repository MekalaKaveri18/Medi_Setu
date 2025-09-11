const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const db = require('./config/db'); // Ensure DB is connected

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/user', userRoutes);
app.use('/api/medicine', medicineRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('✅ MediSetu backend running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

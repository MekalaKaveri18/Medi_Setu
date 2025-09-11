// const db = require('../config/db');

// // Register a new user (no role)
// async function registerUser(username, email, peraWallet, password) {
//   const query = `
//     INSERT INTO users (username, email, pera_wallet, password)
//     VALUES ($1, $2, $3, $4)
//     RETURNING id, username, email;
//   `;
//   const values = [username, email, peraWallet, password];
//   const result = await db.query(query, values);
//   return result.rows[0];
// }

// // Find a user by email
// async function findUserByEmail(email) {
//   const query = `SELECT * FROM users WHERE email = $1;`;
//   const result = await db.query(query, [email]);
//   return result.rows[0];
// }

// // Optional: Find a user by pera wallet
// async function findUserByWallet(peraWallet) {
//   const query = `SELECT * FROM users WHERE pera_wallet = $1;`;
//   const result = await db.query(query, [peraWallet]);
//   return result.rows[0];
// }

// module.exports = {
//   registerUser,
//   findUserByEmail,
//   findUserByWallet
// };


const pool = require('../config/db');

// ✅ Find user by email
const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// ✅ Register new user
const registerUser = async (username, email, peraWallet, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (username, email, pera_wallet, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, peraWallet, hashedPassword]
  );
  return result.rows[0];
};

// ✅ Properly export functions
module.exports = {
  findUserByEmail,
  registerUser
};


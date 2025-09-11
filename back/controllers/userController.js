




// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const {
//   registerUser,
//   findUserByEmail
// } = require('../models/userModel');

// // User Registration (No role required)
// const signup = async (req, res) => {
//   const { username, email, peraWallet, password } = req.body;

//   try {
//     const existingUser = await findUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await registerUser(username, email, peraWallet, hashedPassword);

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: {
//         id: newUser.id,
//         username: newUser.username,
//         email: newUser.email
//       }
//     });
//   } catch (err) {
//     console.error('Signup Error:', err);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };

// // User Login (Role used for redirect only)
// const login = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const user = await findUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found. Please sign up first.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: '2d'
//     });

//     // Determine redirect page based on selected role
//     let redirectPage;
//     if (role === 'borrower') {
//       redirectPage = '/borrower.html';
//     } else if (role === 'lender') {
//       redirectPage = '/lender.html';
//     } else {
//       redirectPage = '/'; // fallback
//     }

//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       redirectPage,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         peraWallet: user.pera_wallet
//       }
//     });
//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ error: 'Login failed' });
//   }
// };

// module.exports = {
//   signup,
//   login
// };


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  registerUser,
  findUserByEmail
} = require('../models/userModel');


// Signup
const signup = async (req, res) => {
  const { username, email, peraWallet, password } = req.body;

  console.log('📥 Signup request received with:', req.body); // ✅ Debug log

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log('⚠️ Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await registerUser(username, email, peraWallet, hashedPassword);

    console.log('✅ New user inserted into DB:', newUser); // ✅ Confirm insertion

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        peraWallet: newUser.pera_wallet
      }
    });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Login request received with:', req.body); // ✅ Debug log

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '2d'
    });

    console.log('✅ Login successful for:', email);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        peraWallet: user.pera_wallet
      }
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = {
  signup,
  login
};

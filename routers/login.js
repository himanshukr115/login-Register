const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');
dotenv.config();
router.use(cookieParser());
const User = require('../models/user.model');
router.use(express.urlencoded({ extended: false }));


router.get('/login', (req, res) => {

  res.render('./page/login');
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('./page/login', { error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('./page/login', { error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'Strict',
    });

    // Save the session
    req.session.userId = user._id;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).render('login', { error: 'Something went wrong during login.' });
  }
});


module.exports = router;  
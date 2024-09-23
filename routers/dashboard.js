// routes/dashboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
//const WorkFlow = require('../models/WorkFlow'); // Ensure correct import
// const isAuthenticated = require('../middleware/isAuthenticated');
// const isEmailVerified = require('../middleware/isEmailVerified');
// isAuthenticated,isEmailVerified,

router.get('/dashboard',  async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)

    if (!user) {
      return res.redirect('/login');
    }

    res.render('./afterlogin/dashboard', {
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
     
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;

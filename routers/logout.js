const express = require('express');
const router = express.Router();
router.post('/logout', (req, res) => {
    // Clear the session data
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Failed to logout. Please try again.' });
      }
      // Redirect the user to the login page or any other page
      res.redirect('/login');
    });
  });
  
module.exports = router;
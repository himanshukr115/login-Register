require('dotenv').config();
const express = require('express')
const router = express.Router();
const axios = require('axios');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const session = require('express-session');
router.use(express.urlencoded({ extended: false }));
const User = require('../models/user.model');

// const ONE_SIGNAL_APP_ID = '5aa87488-01bf-4ec0-bfb9-b0ecaf70e669';
// const ONE_SIGNAL_REST_API_KEY = 'NWFmYTRhY2EtYmM0OS00Yzk1LTk0ZjgtNmUyMTU5YTdiZGIx';



router.get('/register',  (req, res) => {
   
res.render('./page/register',{ error: null });
  });




  router.post('/register', async (req, res) => {
  
    try {
      const { firstName, lastName, email, mobileNumber, whatsappNumber, password, confirmPassword } = req.body;
  
      if (password !== confirmPassword) {
        return res.status(400).render('./page/register', { error: "Passwords do not match.", formData: req.body });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).render('./page/register', { error: "User Pahle se Hi HAi." });
        
      }
  
      // Generate email verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
  
      const hashedPassword = await bcrypt.hash(password, 5);
      const user = new User({
        firstName,
        lastName,
        mobileNumber,
        whatsappNumber,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
      });
      await user.save()
  
      // Prepare email content
      const welcomeEmailBody = `
      <div style="max-width: 500px; margin: auto; margin-top: 20px; padding: 20px; border: 1px solid #E5E7EB; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h1 style="font-size: 2.5rem; text-align: center; font-weight: bold; color: #2D3748;">Welcome to Emprux!</h1>
      <hr style="height: 1px; margin-top: 24px; margin-bottom: 24px; background-color: #E5E7EB; border: none;">
      <p style="font-size: 1.125rem; color: #4A5568; text-align: center;">
          We're thrilled to have you on board! Start automating all your integrations and tasks by building your first Workflow. To get started, please sign in to your account:
      </p>
      <div style="text-align: center; margin-top: 20px;">
          <a href="https://www.example.com/signin" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 1rem;">Sign In</a>
      </div>
      <p style="text-align: center; margin-top: 20px; font-size: 1rem; color: #4A5568;">
          Have an existing Emprux Workflow? Check out our free <a href="#" style="color: #3182CE; text-decoration: none;">class</a> to enhance your skills.
      </p>
      <p style="font-size: 0.875rem; margin-top: 20px; text-align: center; color: #9CA3AF;">
          This message was sent from Emprux, Inc., 1633 Noida, Ground floor, Noida, 201301
      </p>
  </div>
  
      `;
  
      const verificationEmailBody = `
      <div style="max-width: 500px; margin: auto; margin-top: 20px; font-family: Arial, sans-serif;">
      <h1 style="font-size: 2.25rem; text-align: center; font-weight: bold; color: #4CAF50;">Welcome To YourSite</h1>
      <hr style="height: 1px; margin-top: 32px; margin-bottom: 32px; background-color: #E5E7EB; border: none;">
      <p style="font-size: 1.1rem; text-align: center; color: #4A5568;">Dear ${firstName},</p>
      <p style="font-size: 1.1rem; text-align: center; color: #4A5568;">Please click the following link to verify your email:</p>
      <div style="text-align: center; margin-bottom: 16px;">
          <a href="http://localhost:3000/verify-email/${verificationToken}" style="display: inline-block; text-align: center; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      </div>
      <p style="font-size: 1.1rem; text-align: center; color: #4A5568;">Thank you for joining us!</p>
      <p style="font-size: 0.9rem; margin-top: 20px; text-align: center; color: #718096;">This message was sent from YourSite, Inc., 123 Main St, YourCity, 12345</p>
  </div>
  
      `;
  
      // Send welcome email using OneSignal
      await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: process.env.ONE_SIGNAL_APP_ID,
          include_email_tokens: [email],
          email_subject: 'Welcome to Emprux',
          email_body: welcomeEmailBody,
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONE_SIGNAL_REST_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Send verification email using OneSignal
      await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: process.env.ONE_SIGNAL_APP_ID,
          include_email_tokens: [email],
          email_subject: 'Email Verification',
          email_body: verificationEmailBody,
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONE_SIGNAL_REST_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Save user information in session
      req.session.user = { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email };
  
      // Set a cookie to indicate user is logged in
      res.cookie('isLoggedIn', true, { maxAge: 86400000, httpOnly: true }); // Adjust maxAge as needed
  
      // Redirect to dashboard route after successful login
      res.redirect('/');
  
      // Send success response
      // res.status(200).json({ message: "User registered successfully." });
    } catch (error) {
      console.error('Error:', error.message);
      // res.status(500).json({ error: 'Something went wrong while registering the user.' });
      return res.status(500).render('./page/register', { error: "Something went wrong while registering the user." });
    }
  });
module.exports = router;  
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dav4_super_secret_key_12345', {
    expiresIn: '30d',
  });
};

// Create email transporter
const getTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '2525');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
};

// @desc    Register a new student
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      role: 'student',
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Generate password reset OTP and email it
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please enter email' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account with this email exists' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    console.log(`[OTP RESET] Generated OTP for ${email}: ${otp}`);

    // Attempt to send email
    try {
      const transporter = getTransporter();
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@dav4.com',
        to: email,
        subject: 'DAV Bokaro App Password Reset OTP',
        text: `Your password recovery OTP is: ${otp}\n\nThis OTP will expire in 10 minutes. If you did not request this, please ignore.`,
        html: `<p>Your password recovery OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p><p>If you did not request this, please ignore.</p>`,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'OTP sent to your email successfully' });
    } catch (emailError) {
      console.warn('SMTP transporter failed, printed OTP to console instead:', emailError.message);
      res.json({ 
        message: 'OTP generated. Please check server log if SMTP is not configured.',
        debugOtp: otp // Send back for testing if SMTP is not set up
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Please enter email and OTP' });
  }

  try {
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: 'Please enter email, OTP and new password' });
  }

  try {
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      message: 'Password reset successful!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

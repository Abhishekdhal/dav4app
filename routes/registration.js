const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Registration = require('../models/Registration');
const { protect, admin } = require('../middleware/auth');

// Helper to send registration success HTML email
const sendSuccessEmail = async (reg) => {
  try {
    const port = parseInt(process.env.SMTP_PORT || '2525');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    const studentName = `${reg.first_name} ${reg.middle_name || ''} ${reg.last_name || ''}`.replace(/\s+/g, ' ').trim();

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@dav4.com',
      to: reg.email,
      subject: `Registration Successful - D.A.V. Public School, Sector-IV`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background-color: #1976D2; padding: 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">D.A.V. PUBLIC SCHOOL</h1>
            <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">SECTOR-IV, BOKARO STEEL CITY</p>
            <div style="margin: 16px auto 0; background-color: #FF9800; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-block;">
              REGISTRATION CONFIRMED 🎉
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 24px; background-color: #ffffff; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
              Dear <strong>${studentName}</strong>,
            </p>
            <p style="font-size: 15px; line-height: 1.5; margin: 0 0 20px 0;">
              Congratulations! Your registration for <strong>Class XI (Session 2026-2027)</strong> has been successfully received and submitted. Below are your registration details for your reference:
            </p>

            <!-- Details Box -->
            <div style="background-color: #f9f9f9; border-left: 4px solid #1976D2; padding: 16px; margin-bottom: 24px; border-radius: 0 4px 4px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666; width: 40%;"><strong>Registration ID:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333; font-weight: bold;">${reg.id}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666;"><strong>Preferred Stream:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333; font-weight: bold; color: #e65100;">${reg.stream_choice}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666;"><strong>Date of Birth:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333;">${reg.dob}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666;"><strong>Gender:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333;">${reg.gender}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666;"><strong>Contact Number:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333;">${reg.contact}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666;"><strong>Registered Email:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333;">${reg.email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666;"><strong>Father's Name:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333;">${reg.father_title} ${reg.father_name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666;"><strong>Mother's Name:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333;">${reg.mother_title} ${reg.mother_name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #666666; vertical-align: top;"><strong>Residential Address:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #333333; line-height: 1.4;">
                    ${reg.res_house ? reg.res_house + ', ' : ''}${reg.res_street ? reg.res_street + '<br/>' : ''}
                    ${reg.res_locality ? reg.res_locality + ', ' : ''}${reg.res_po_ps ? reg.res_po_ps + '<br/>' : ''}
                    ${reg.res_district ? reg.res_district + ' - ' : ''}${reg.res_pin || ''}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Student Photo Preview -->
            ${reg.student_photo_url ? `
            <div style="text-align: center; margin-bottom: 24px;">
              <p style="font-size: 13px; color: #777777; margin: 0 0 8px 0;">Applicant Photo</p>
              <img src="${reg.student_photo_url}" alt="Student Photo" style="width: 110px; height: 110px; object-fit: cover; border-radius: 6px; border: 2px solid #e0e0e0; display: inline-block;" />
            </div>
            ` : ''}

            <p style="font-size: 14px; line-height: 1.5; color: #666666; margin: 0 0 8px 0;">
              <strong>Note:</strong> Your registration form status is currently <strong>PENDING</strong>. You will receive further updates regarding the admission process, document verification, and status approval on this email.
            </p>
            <p style="font-size: 14px; line-height: 1.5; color: #666666; margin: 0 0 24px 0;">
              Please log in to the <strong>DAV Bokaro Registration App</strong> using your registered email and password to track the application or update information if required.
            </p>

            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            
            <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #e0e0e0;">
            © 2026 D.A.V. Public School, Sector-IV, Bokaro Steel City.<br/>
            Affiliated to CBSE, New Delhi.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] Registration confirmation email sent to ${reg.email}`);
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send registration confirmation email: ${err.message}`);
  }
};

// @desc    Create a new registration
// @route   POST /api/registrations
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Check if registration already exists for this email
    const existingReg = await Registration.findOne({ email: req.body.email });
    if (existingReg && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Registration form already submitted for this email.' });
    }

    const registration = new Registration(req.body);
    const savedRegistration = await registration.save();
    
    // Trigger automated success email asynchronously
    sendSuccessEmail(savedRegistration);

    res.status(201).json(savedRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const registrations = await Registration.find({}).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get registration by email
// @route   GET /api/registrations/email/:email
// @access  Private
router.get('/email/:email', protect, async (req, res) => {
  try {
    // Check authorization: only admin or the user themselves can view their form
    if (req.user.role !== 'admin' && req.user.email !== req.params.email) {
      return res.status(403).json({ message: 'Not authorized to view this registration.' });
    }

    const registration = await Registration.findOne({ email: req.params.email });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get registration by ID
// @route   GET /api/registrations/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({ id: req.params.id });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && req.user.email !== registration.email) {
      return res.status(403).json({ message: 'Not authorized to view this registration.' });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a registration
// @route   PUT /api/registrations/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let registration = await Registration.findOne({ id: req.params.id });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && req.user.email !== registration.email) {
      return res.status(403).json({ message: 'Not authorized to update this registration.' });
    }

    // If student is updating, make sure they don't manually approve themselves
    if (req.user.role !== 'admin') {
      req.body.status = registration.status; // lock the status to previous
    }

    const updatedRegistration = await Registration.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

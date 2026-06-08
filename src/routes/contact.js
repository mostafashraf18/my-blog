const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  res.render('contact', { title: 'Contact', active: 'contact', success: null, error: null });
});

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.render('contact', {
      title: 'Contact', active: 'contact',
      success: null, error: 'Please fill in all required fields.'
    });
  }

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: subject || `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br>')}</p>`
    });

    res.render('contact', {
      title: 'Contact', active: 'contact',
      success: 'Your message was sent! I\'ll get back to you soon.', error: null
    });
  } catch (err) {
    console.error('Mail error:', err);
    res.render('contact', {
      title: 'Contact', active: 'contact',
      success: null, error: 'Something went wrong. Please try again or email me directly.'
    });
  }
});

module.exports = router;

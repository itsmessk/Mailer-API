const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/send-email', async (req, res) => {
  const requestData = req.body;

  let htmlContent = '<h2>New Submission</h2><ul>';
  for (const key in requestData) {
    htmlContent += `<li><strong>${key}:</strong> ${requestData[key]}</li>`;
  }
  htmlContent += '</ul>';

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use custom SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Mailer API" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    subject: 'New Job Application Received',
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mail Sender running at port: ${PORT}`);
});

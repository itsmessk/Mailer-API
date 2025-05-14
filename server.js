import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['POST'],
        credentials: true,
    }
));
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const requestData = req.body;

  let htmlContent = '<h2>New Submission</h2><ul>';
  for (const key in requestData) {
    htmlContent += `<li><strong>${key}:</strong> ${requestData[key]}</li>`;
  }
  htmlContent += '</ul>';

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Mailer API" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    subject: 'New Submission Received',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email send failed:', err);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Mail sender running in port: ${PORT}`);
});

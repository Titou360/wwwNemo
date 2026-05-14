const express = require('express');
const nodemailer = require('nodemailer');
const dns = require('dns');
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { ...options, family: 4 }, callback);
  },
  tls: { rejectUnauthorized: false },
});

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Champs obligatoires manquants.' });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.SMTP_TO,
      subject: `[Nemo Contact] ${subject}`,
      html: `
        <h2 style="color:#FF6B35;">Nouveau message — Nemo Solutions</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:8px;font-weight:bold;width:120px;">Nom</td><td style="padding:8px;">${name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Téléphone</td><td style="padding:8px;">${phone || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Sujet</td><td style="padding:8px;">${subject}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;white-space:pre-wrap;">${message}</td></tr>
        </table>
      `,
    });

    res.json({ message: 'Email envoyé avec succès.' });
  } catch (err) {
    console.error('❌ Erreur envoi email :', err);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
  }
});

module.exports = router;

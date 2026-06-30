const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, date, time } = req.body || {};

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'axentrat@gmail.com',
      subject: 'New Demo Request from ' + name,
      html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px;">'
        + '<h2 style="color:#0fbf7b;border-bottom:2px solid #0fbf7b;padding-bottom:10px;margin-top:0;">New Demo Booking Request</h2>'
        + '<p style="color:#4b5563;">A user has requested a live demo for Ayu Health Suite.</p>'
        + '<table style="width:100%;border-collapse:collapse;margin-top:15px;">'
        + '<tr style="background:#f9fafb;"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;width:35%;">Full Name</td><td style="padding:10px;border:1px solid #e5e7eb;">' + name + '</td></tr>'
        + '<tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Email</td><td style="padding:10px;border:1px solid #e5e7eb;">' + email + '</td></tr>'
        + '<tr style="background:#f9fafb;"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Phone</td><td style="padding:10px;border:1px solid #e5e7eb;">' + phone + '</td></tr>'
        + '<tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Preferred Date</td><td style="padding:10px;border:1px solid #e5e7eb;">' + date + '</td></tr>'
        + '<tr style="background:#f9fafb;"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Time Slot</td><td style="padding:10px;border:1px solid #e5e7eb;">' + time + '</td></tr>'
        + '</table>'
        + '<p style="font-size:0.85rem;color:#64748b;margin-top:20px;text-align:center;border-top:1px solid #e5e7eb;padding-top:15px;">Powered by Axentratech - ayuhealthsuite.online</p>'
        + '</div>'
    });
    return res.status(200).json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Resend Demo Email Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email.' });
  }
};

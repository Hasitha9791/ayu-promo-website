module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['axentrat@gmail.com'],
        subject: 'New Inquiry: ' + subject + ' - from ' + name,
        html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px;">'
          + '<h2 style="color:#0fbf7b;border-bottom:2px solid #0fbf7b;padding-bottom:10px;margin-top:0;">New Contact Inquiry</h2>'
          + '<p style="color:#4b5563;">A user sent an inquiry via the Ayu Health Suite website.</p>'
          + '<table style="width:100%;border-collapse:collapse;margin-top:15px;">'
          + '<tr style="background:#f9fafb;"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;width:35%;">Name</td><td style="padding:10px;border:1px solid #e5e7eb;">' + name + '</td></tr>'
          + '<tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Email</td><td style="padding:10px;border:1px solid #e5e7eb;">' + email + '</td></tr>'
          + '<tr style="background:#f9fafb;"><td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">Subject</td><td style="padding:10px;border:1px solid #e5e7eb;">' + subject + '</td></tr>'
          + '</table>'
          + '<div style="margin-top:20px;padding:15px;background:#f3f4f6;border-radius:6px;border-left:4px solid #0fbf7b;">'
          + '<h4 style="margin:0 0 8px 0;color:#1f2937;">Message:</h4>'
          + '<p style="margin:0;white-space:pre-line;line-height:1.6;color:#4b5563;">' + message + '</p>'
          + '</div>'
          + '<p style="font-size:0.85rem;color:#64748b;margin-top:20px;text-align:center;border-top:1px solid #e5e7eb;padding-top:15px;">Powered by Axentratech - ayuhealthsuite.online</p>'
          + '</div>'
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, messageId: data.id });
    } else {
      console.error('Resend API error:', data);
      return res.status(500).json({ error: data.message || 'Resend API rejected the request.' });
    }
  } catch (error) {
    console.error('Inquiry email send error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email.' });
  }
};

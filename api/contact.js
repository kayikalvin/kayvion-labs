// api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, service, message, company } = req.body;

  // Honeypot check — bots fill hidden fields, real users never see this one
  if (company) {
    // Silently pretend success so bots don't learn anything
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Kayvion Labs Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New inquiry: ${service || "General"} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #1A1A1A;">New contact form submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; width: 120px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Email</td>
              <td style="padding: 8px 0;">${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Service</td>
              <td style="padding: 8px 0;">${escapeHtml(service || "Not specified")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(message)}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}

// Prevent HTML injection in the email body
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
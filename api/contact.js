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

  // Where notifications land — separate from the Gmail account used to
  // authenticate/send. Falls back to the sending account itself if
  // NOTIFY_TO isn't set, so nothing breaks for existing deployments.
  const notifyTo = process.env.NOTIFY_TO || process.env.GMAIL_USER;

  try {
    await transporter.sendMail({
      from: `"Kayvion Labs" <${process.env.GMAIL_USER}>`,
      to: notifyTo,
      replyTo: email,
      subject: `New inquiry: ${service || "General"} — from ${name}`,
      html: buildEmailHtml({ name, email, service, message }),
      text: buildEmailText({ name, email, service, message }), // plain-text fallback
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

/* ─── PLAIN TEXT FALLBACK ──────────────────────────────────────────────────
   Some clients / spam filters prefer or require a text/plain part.
   Nodemailer attaches this as a multipart alternative automatically. */
function buildEmailText({ name, email, service, message }) {
  return [
    "New contact form submission — Kayvion Labs",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Service: ${service || "Not specified"}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

/* ─── HTML EMAIL ────────────────────────────────────────────────────────────
   Email clients (esp. Gmail) strip <style> tags and most modern CSS, so
   everything here is table-based layout with inline styles only — this is
   the one place "old web" patterns are still the correct approach. */
function buildEmailHtml({ name, email, service, message }) {
  const ink = "#1A1A1A";
  const muted = "#8F8C83";
  const border = "#D9D5CE";
  const bgAlt = "#F2F1ED";
  const accent = "#2255FF";
  const white = "#FFFFFF";

  const row = (label, value, isLast = false) => `
    <tr>
      <td style="padding: 14px 0; ${isLast ? "" : `border-bottom: 1px solid ${border};`} vertical-align: top; width: 120px;">
        <span style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${muted};">
          ${label}
        </span>
      </td>
      <td style="padding: 14px 0; ${isLast ? "" : `border-bottom: 1px solid ${border};`} vertical-align: top;">
        <span style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: ${ink}; line-height: 1.5;">
          ${value}
        </span>
      </td>
    </tr>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New contact form submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bgAlt}; font-family: Helvetica, Arial, sans-serif;">

  <!-- Preheader (hidden preview text in inbox list) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    New inquiry from ${escapeHtml(name)} — ${escapeHtml(service || "General")}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${bgAlt}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: ${white}; border-radius: 16px; overflow: hidden; border: 1px solid ${border};">

          <!-- Header band -->
          <tr>
            <td style="background-color: ${ink}; padding: 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 700; color: ${white}; letter-spacing: -0.3px;">
                      Kayvion<span style="color: ${accent};">Labs</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4);">
                      New Inquiry
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 6px 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${muted};">
                Contact form submission
              </p>
              <h1 style="margin: 0 0 28px 0; font-family: Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: ${ink}; line-height: 1.25;">
                ${escapeHtml(name)} wants to talk.
              </h1>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                ${row("Name", escapeHtml(name))}
                ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color: ${accent}; text-decoration: none;">${escapeHtml(email)}</a>`)}
                ${row("Service", escapeHtml(service || "Not specified"), true)}
              </table>

              <div style="background-color: ${bgAlt}; border: 1px solid ${border}; border-radius: 12px; padding: 20px 24px;">
                <p style="margin: 0 0 8px 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${muted};">
                  Message
                </p>
                <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: ${ink}; line-height: 1.65; white-space: pre-wrap;">${escapeHtml(message)}</p>
              </div>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background-color: ${ink}; color: ${white}; text-decoration: none; font-family: Helvetica, Arial, sans-serif; font-weight: 700; font-size: 15px; letter-spacing: -0.2px; padding: 14px 32px; border-radius: 100px;">
                      Reply to ${escapeHtml(name.split(" ")[0])} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid ${border}; background-color: ${bgAlt};">
              <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: ${muted}; text-align: center;">
                Sent automatically from the contact form on kayvionlabs.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}
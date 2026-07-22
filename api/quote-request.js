// api/quote-request.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    email,
    phone,
    business,
    siteType,
    description,
    pages,
    features,
    timeline,
  } = req.body || {};

  // Basic required validation (frontend requires name/email/description)
  if (!name || !email || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Simple email format check
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
      from: `"Kayvion Labs" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New quote request — ${siteType || "General"} — from ${name}`,
      text: buildQuoteText({
        name,
        email,
        phone,
        business,
        siteType,
        description,
        pages,
        features,
        timeline,
      }),
      html: buildQuoteHtml({
        name,
        email,
        phone,
        business,
        siteType,
        description,
        pages,
        features,
        timeline,
      }),
    });

    // Frontend expects res.ok to be true on success and doesn't care about body shape
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Quote send error:", error);
    return res.status(500).json({ error: "Failed to send quote request" });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildQuoteText({
  name,
  email,
  phone,
  business,
  siteType,
  description,
  pages,
  features,
  timeline,
}) {
  return [
    "New quote request — Kayvion Labs",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    business ? `Business: ${business}` : null,
    siteType ? `Site type: ${siteType}` : null,
    pages ? `Pages: ${pages}` : null,
    features ? `Features: ${features}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    "",
    "Description:",
    description,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildQuoteHtml({
  name,
  email,
  phone,
  business,
  siteType,
  description,
  pages,
  features,
  timeline,
}) {
  const ink = "#1A1A1A";
  const muted = "#8F8C83";
  const border = "#D9D5CE";
  const bgAlt = "#F2F1ED";
  const accent = "#2255FF";
  const white = "#FFFFFF";

  const row = (label, value, isLast = false) => `
    <tr>
      <td style="padding: 14px 0; ${isLast ? "" : `border-bottom: 1px solid ${border};`} vertical-align: top; width: 140px;">
        <span style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${muted};">
          ${escapeHtml(label)}
        </span>
      </td>
      <td style="padding: 14px 0; ${isLast ? "" : `border-bottom: 1px solid ${border};`} vertical-align: top;">
        <span style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: ${ink}; line-height: 1.5;">
          ${escapeHtml(value ?? "")}
        </span>
      </td>
    </tr>
  `;

  const detailsRows = [
    row("Name", name),
    row("Email", email),
    phone ? row("Phone", phone) : null,
    business ? row("Business", business) : null,
    siteType ? row("Site type", siteType) : null,
    pages ? row("Pages", pages) : null,
    features ? row("Features", features) : null,
    timeline ? row("Timeline", timeline, true) : null,
  ].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New quote request</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bgAlt}; font-family: Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${bgAlt}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: ${white}; border-radius: 16px; overflow: hidden; border: 1px solid ${border};">
          <tr>
            <td style="background-color: ${ink}; padding: 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 700; color: ${white}; letter-spacing: -0.3px;">
                      Kayvion<span style="color: ${accent};">Labs</span>
                  </td>
                  <td align="right">
                    <span style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4);">
                      New Quote Request
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 6px 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${muted};">
                Quote request
              </p>

              <h1 style="margin: 0 0 28px 0; font-family: Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: ${ink}; line-height: 1.25;">
                ${escapeHtml(name)} wants a quote.
              </h1>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                ${detailsRows.join("")}
              </table>

              <div style="background-color: ${bgAlt}; border: 1px solid ${border}; border-radius: 12px; padding: 20px 24px;">
                <p style="margin: 0 0 8px 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${muted};">
                  Description
                </p>
                <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: ${ink}; line-height: 1.65; white-space: pre-wrap;">
                  ${escapeHtml(description)}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid ${border}; background-color: ${bgAlt};">
              <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: ${muted}; text-align: center;">
                Sent automatically from /get-a-quote on kayvionlabs.com
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

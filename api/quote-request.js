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

  // Where internal lead notifications land — separate from the Gmail account
  // used to authenticate/send. Falls back to the sending account itself if
  // NOTIFY_TO isn't set, so nothing breaks for existing deployments.
  const notifyTo = process.env.NOTIFY_TO || process.env.GMAIL_USER;

  // Build a wa.me link straight to the LEAD's own WhatsApp number (if they
  // gave us a phone), pre-filled with a friendly opener referencing their
  // request — so whoever reads the email can tap through and reply on
  // WhatsApp immediately instead of typing a fresh message from scratch.
  const leadWhatsAppUrl = buildLeadWhatsAppUrl({ phone, name, siteType });

  // Kayvion's own WhatsApp number — used in the client's confirmation email
  // so they have an immediate, direct channel while they wait for a reply.
  const kayvionWhatsAppNumber = process.env.KAYVION_WHATSAPP_NUMBER || "254720332844";
  const kayvionWhatsAppUrl = `https://wa.me/${kayvionWhatsAppNumber}?text=${encodeURIComponent(
    `Hi Kayvion Labs, I just requested a quote${siteType ? ` for a ${siteType}` : ""} — following up here.`,
  )}`;

  // Send the internal lead-notification email and the client-facing
  // confirmation email in parallel. The client confirmation is a nice-to-have:
  // if it fails (e.g. their inbox rejects it), that should never stop the
  // lead itself from reaching Kayvion, so we don't let it throw the request.
  try {
    const [internalResult, clientResult] = await Promise.allSettled([
      transporter.sendMail({
        from: `"Kayvion Labs" <${process.env.GMAIL_USER}>`,
        to: notifyTo,
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
          leadWhatsAppUrl,
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
          leadWhatsAppUrl,
        }),
      }),
      transporter.sendMail({
        from: `"Kayvion Labs" <${process.env.GMAIL_USER}>`,
        to: email,
        replyTo: notifyTo,
        subject: "We've received your quote request — Kayvion Labs",
        text: buildClientConfirmationText({ name, siteType, kayvionWhatsAppUrl }),
        html: buildClientConfirmationHtml({ name, siteType, kayvionWhatsAppUrl }),
      }),
    ]);

    if (internalResult.status === "rejected") {
      console.error("Quote send error (internal notification):", internalResult.reason);
      return res.status(500).json({ error: "Failed to send quote request" });
    }

    if (clientResult.status === "rejected") {
      // Non-fatal: log it, but the lead already reached Kayvion successfully.
      console.error("Quote send error (client confirmation):", clientResult.reason);
    }

    // Frontend expects res.ok to be true on success and doesn't care about body shape
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Quote send error (unexpected):", error);
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

// Normalizes a phone number into E.164-ish digits-only form for wa.me links.
// Handles common Kenyan formats: 07xx…, 01xx…, +254…, 254…
function normalizePhoneForWhatsApp(raw) {
  if (!raw) return null;
  let digits = String(raw).replace(/[^\d+]/g, "");
  digits = digits.replace(/^\+/, "");

  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }
  if (digits.length >= 9 && digits.length <= 12) return digits;
  return null;
}

function buildLeadWhatsAppUrl({ phone, name, siteType }) {
  const normalized = normalizePhoneForWhatsApp(phone);
  if (!normalized) return null;

  const firstName = (name || "").trim().split(" ")[0] || "there";
  const message = `Hi ${firstName}, this is Kayvion Labs — thanks for your quote request${
    siteType ? ` for a ${siteType}` : ""
  }. Let's talk through what you need.`;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/* ─── CLIENT CONFIRMATION EMAIL ─────────────────────────────────────────────
   Sent to the lead themselves right after they submit the form, so they
   know their request landed and roughly what to expect next. Kept short —
   this is a receipt, not a sales pitch. */

function buildClientConfirmationText({ name, siteType, kayvionWhatsAppUrl }) {
  const firstName = (name || "").trim().split(" ")[0] || "there";
  return [
    `Hi ${firstName},`,
    "",
    `Thanks for reaching out to Kayvion Labs${siteType ? ` about your ${siteType}` : ""}. We've received your request and an engineer will review it shortly — you'll typically hear back from us within one business day with a real quote.`,
    "",
    "If it's urgent, message us directly on WhatsApp:",
    kayvionWhatsAppUrl,
    "",
    "Talk soon,",
    "Kayvion Labs",
  ].join("\n");
}

function buildClientConfirmationHtml({ name, siteType, kayvionWhatsAppUrl }) {
  const ink = "#1A1A1A";
  const muted = "#8F8C83";
  const border = "#D9D5CE";
  const bgAlt = "#F2F1ED";
  const accent = "#2255FF";
  const white = "#FFFFFF";
  const whatsappGreen = "#25D366";

  const firstName = (name || "").trim().split(" ")[0] || "there";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We've received your quote request</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bgAlt}; font-family: Helvetica, Arial, sans-serif;">

  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    Thanks for reaching out — we'll be in touch shortly.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${bgAlt}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: ${white}; border-radius: 16px; overflow: hidden; border: 1px solid ${border};">

          <tr>
            <td style="background-color: ${ink}; padding: 32px 40px;">
              <span style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 700; color: ${white}; letter-spacing: -0.3px;">
                Kayvion<span style="color: ${accent};">Labs</span>
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 6px 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${muted};">
                Request received
              </p>
              <h1 style="margin: 0 0 20px 0; font-family: Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: ${ink}; line-height: 1.25;">
                Thanks, ${escapeHtml(firstName)} — we're on it.
              </h1>

              <p style="margin: 0 0 20px 0; font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: ${ink}; line-height: 1.7;">
                We've received your quote request${siteType ? ` for a <strong>${escapeHtml(siteType)}</strong>` : ""}. An engineer on our team will review it and get back to you with a real, scoped quote — usually within one business day. No auto-generated numbers, no spam follow-ups.
              </p>

              <div style="background-color: ${bgAlt}; border: 1px solid ${border}; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px;">
                <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: ${muted}; line-height: 1.65;">
                  In the meantime, feel free to reply to this email with any extra details, or reach us directly on WhatsApp if it's urgent.
                </p>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${kayvionWhatsAppUrl}" style="display: inline-flex; align-items: center; gap: 8px; background-color: ${whatsappGreen}; color: ${white}; text-decoration: none; font-family: Helvetica, Arial, sans-serif; font-weight: 700; font-size: 15px; letter-spacing: -0.2px; padding: 14px 30px; border-radius: 100px;">
                      Message us on WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid ${border}; background-color: ${bgAlt};">
              <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: ${muted}; text-align: center;">
                Kayvion Labs · Nairobi, Kenya · info@kayvionlabs.com
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
  leadWhatsAppUrl,
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
    leadWhatsAppUrl ? `Message on WhatsApp: ${leadWhatsAppUrl}` : null,
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
  leadWhatsAppUrl,
}) {
  const ink = "#1A1A1A";
  const muted = "#8F8C83";
  const border = "#D9D5CE";
  const bgAlt = "#F2F1ED";
  const accent = "#2255FF";
  const white = "#FFFFFF";
  const whatsappGreen = "#25D366";

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
    timeline ? row("Timeline", timeline, !leadWhatsAppUrl) : null,
  ].filter(Boolean);

  // WhatsApp CTA button — inline-styled table-button pattern (Gmail-safe),
  // only rendered when we could derive a usable phone number from the lead.
  const whatsappButton = leadWhatsAppUrl
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 14px;">
        <tr>
          <td>
            <a href="${leadWhatsAppUrl}" style="display: inline-flex; align-items: center; gap: 8px; background-color: ${whatsappGreen}; color: ${white}; text-decoration: none; font-family: Helvetica, Arial, sans-serif; font-weight: 700; font-size: 14px; letter-spacing: -0.1px; padding: 12px 22px; border-radius: 100px;">
              Message ${escapeHtml((name || "").split(" ")[0] || "them")} on WhatsApp →
            </a>
          </td>
        </tr>
      </table>
    `
    : "";

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
                    </span>
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

              <h1 style="margin: 0 0 12px 0; font-family: Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: ${ink}; line-height: 1.25;">
                ${escapeHtml(name)} wants a quote.
              </h1>

              ${whatsappButton}

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 28px; margin-bottom: 28px;">
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

              <!-- Fallback: reply by email, always available regardless of phone -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background-color: ${ink}; color: ${white}; text-decoration: none; font-family: Helvetica, Arial, sans-serif; font-weight: 700; font-size: 14px; letter-spacing: -0.1px; padding: 12px 26px; border-radius: 100px;">
                      Reply by email →
                    </a>
                  </td>
                </tr>
              </table>
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
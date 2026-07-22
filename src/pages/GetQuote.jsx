import { useState } from 'react';

/**
 * QuoteRequest — self-serve quote form for kayvionlabs.com
 *
 * Visitor describes the site they want. On submit:
 *  - POSTs to /api/quote-request
 *  - Backend drafts a quote via Claude (rule-based price floor/ceiling enforced)
 *  - Draft + lead land in Kayvion's inbox for manual review — nothing auto-sends to the client.
 */

const SITE_TYPES = [
  { value: 'landing', label: 'Landing page / one-pager', from: 55000 },
  { value: 'business', label: 'Business website (multi-page)', from: 65000 },
  { value: 'ecommerce', label: 'Online store', from: 95000 },
  { value: 'webapp', label: 'Web app / custom system', from: 150000 },
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  business: '',
  siteType: 'business',
  description: '',
  pages: '',
  features: '',
  timeline: '',
};

function QuoteRequest() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const selectedType = SITE_TYPES.find((t) => t.value === form.siteType);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) {
      setStatus('error');
      setErrorMsg('Tell us your name, email, and what you want built.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Try again or email us directly.');
    }
  }

  if (status === 'sent') {
    return (
      <section style={styles.section}>
        <div style={styles.card}>
          <p style={styles.eyebrow}>Request received</p>
          <h2 style={styles.h2}>We're on it.</h2>
          <p style={styles.body}>
            No auto-generated quote lands in your inbox — an engineer reviews what you told us
            and replies with a real number, usually within a day.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Get a quote</p>
        <h2 style={styles.h2}>Tell us what you're building.</h2>
        <p style={styles.body}>
          Basic sites start at KES {selectedType.from.toLocaleString()}. Describe what you want
          below — an engineer reviews every request before anything is sent back to you.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <Field label="Your name">
              <input style={styles.input} value={form.name} onChange={update('name')} required />
            </Field>
            <Field label="Email">
              <input
                type="email"
                style={styles.input}
                value={form.email}
                onChange={update('email')}
                required
              />
            </Field>
          </div>

          <div style={styles.row}>
            <Field label="Phone (optional)">
              <input style={styles.input} value={form.phone} onChange={update('phone')} />
            </Field>
            <Field label="Business name (optional)">
              <input style={styles.input} value={form.business} onChange={update('business')} />
            </Field>
          </div>

          <Field label="What are you building?">
            <select style={styles.input} value={form.siteType} onChange={update('siteType')}>
              {SITE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label} — from KES {t.from.toLocaleString()}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Describe what you want built">
            <textarea
              style={{ ...styles.input, minHeight: 110, resize: 'vertical' }}
              value={form.description}
              onChange={update('description')}
              placeholder="e.g. A site for my hardware shop with a product catalogue, WhatsApp ordering, and an about page."
              required
            />
          </Field>

          <div style={styles.row}>
            <Field label="Estimated pages (optional)">
              <input
                type="number"
                min="1"
                style={styles.input}
                value={form.pages}
                onChange={update('pages')}
              />
            </Field>
            <Field label="Timeline (optional)">
              <input
                style={styles.input}
                placeholder="e.g. 2 weeks, no rush"
                value={form.timeline}
                onChange={update('timeline')}
              />
            </Field>
          </div>

          <Field label="Specific features (optional)">
            <input
              style={styles.input}
              placeholder="e.g. M-Pesa payments, booking calendar, multi-language"
              value={form.features}
              onChange={update('features')}
            />
          </Field>

          {status === 'error' && <p style={styles.errorText}>{errorMsg}</p>}

          <button type="submit" style={styles.button} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Request a quote →'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

const styles = {
  section: {
    background: '#F2F1ED',
    padding: '64px 24px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 560,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: 12,
    color: '#8a8a85',
    margin: 0,
  },
  h2: {
    fontSize: 32,
    lineHeight: 1.15,
    margin: '8px 0 12px',
    color: '#1a1a1a',
  },
  body: {
    color: '#555',
    marginBottom: 28,
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  row: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: '1 1 200px',
  },
  label: {
    fontSize: 13,
    color: '#666',
  },
  input: {
    padding: '10px 12px',
    fontSize: 15,
    border: '1px solid #d8d6cf',
    borderRadius: 6,
    background: '#fff',
    color: '#1a1a1a',
    fontFamily: 'inherit',
  },
  button: {
    marginTop: 8,
    padding: '14px 20px',
    fontSize: 15,
    fontWeight: 600,
    background: '#1a1a1a',
    color: '#F2F1ED',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  errorText: {
    color: '#b3261e',
    fontSize: 14,
    margin: 0,
  },
};

export default function GetQuote() {
  return <QuoteRequest />;
}

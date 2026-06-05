import { useState } from 'react';
import { SDGS } from '../data/sdgs';
import s from './Register.module.css';

/* ─────────────────────────────────────────────────────────────
   ⚙️  PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL RIGHT HERE ⬇️
   ───────────────────────────────────────────────────────────── */
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
/* ─────────────────────────────────────────────────────────────
   After deploying your Apps Script, replace the string above
   with the URL that looks like:
   https://script.google.com/macros/s/AKfyc.../exec
   ───────────────────────────────────────────────────────────── */

const DISTRICTS = [
  'Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
  'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar',
  'Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
  'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla',
  'Monaragala','Ratnapura','Kegalle',
];

const INITIAL = {
  fullName: '', email: '', phone: '',
  school: '', district: '', gradeYear: '',
  category: '', participationType: '', sdgInterest: '',
  message: '',
};

export default function Register({ onBack }) {
  const [form,    setForm]    = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [status,  setStatus]  = useState('idle'); // idle | sending | success | error

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())     e.fullName     = 'Full name is required';
    if (!form.email.trim())        e.email        = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim())        e.phone        = 'Phone number is required';
    if (!form.school.trim())       e.school       = 'School / university is required';
    if (!form.district)            e.district     = 'Please select your district';
    if (!form.category)            e.category     = 'Please select a category';
    if (!form.participationType)   e.participationType = 'Please select participation type';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('sending');

    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    payload.append('submittedAt', new Date().toLocaleString('en-GB'));

    try {
      await fetch(APPS_SCRIPT_URL, { method: 'POST', body: payload, mode: 'no-cors' });
      setStatus('success');
      setForm(INITIAL);
    } catch {
      setStatus('error');
    }
  };

  /* ── Success screen ───────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className={s.page}>
        <div className={s.successWrap}>
          <div className={s.successIcon}>🎉</div>
          <h2>You're registered!</h2>
          <p>Thank you, <strong>{form.fullName || 'participant'}</strong>! We've received your entry for the Islandwide World's Largest Lesson 2026.</p>
          <p style={{marginTop:12}}>Check your email for confirmation. Follow <strong>@wll.srilanka</strong> on Instagram for updates.</p>
          <div className={s.successBtns}>
            <button className={s.btnPrimary} onClick={() => setStatus('idle')}>Register Another</button>
            <button className={s.btnGhost}   onClick={onBack}>Back to Website</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>

      {/* Header */}
      <div className={s.header}>
        <button className={s.backBtn} onClick={onBack}>
          ← Back to Website
        </button>
        <div className={s.headerBrand}>
          <img src="/assets/wll-logo.png" alt="WLL" className={s.logo} />
          <div>
            <div className={s.brandName}>WLL 2026 Registration</div>
            <div className={s.brandSub}>Islandwide World's Largest Lesson · Sri Lanka</div>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className={s.container}>
        <div className={s.hero}>
          <h1>Register for <span className={s.accent}>WLL 2026</span></h1>
          <p>Fill in your details to participate in the Islandwide World's Largest Lesson 2026, organised by AIESEC in Sri Lanka. Participation is completely <strong>free</strong>.</p>
        </div>

        <form className={s.form} onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: Personal Details ─────────────── */}
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>
              <span className={s.legendNum}>1</span> Personal Details
            </legend>

            <div className={s.row}>
              <Field label="Full Name" required error={errors.fullName}>
                <input
                  type="text" placeholder="e.g. Dulain Jayasumana"
                  value={form.fullName} onChange={e => set('fullName', e.target.value)}
                  className={errors.fullName ? s.inputErr : ''}
                />
              </Field>
            </div>

            <div className={s.row2}>
              <Field label="Email Address" required error={errors.email}>
                <input
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)}
                  className={errors.email ? s.inputErr : ''}
                />
              </Field>
              <Field label="Phone / WhatsApp" required error={errors.phone}>
                <input
                  type="tel" placeholder="07X XXX XXXX"
                  value={form.phone} onChange={e => set('phone', e.target.value)}
                  className={errors.phone ? s.inputErr : ''}
                />
              </Field>
            </div>
          </fieldset>

          {/* ── Section 2: School Details ────────────────── */}
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>
              <span className={s.legendNum}>2</span> School / University Details
            </legend>

            <div className={s.row}>
              <Field label="School or University Name" required error={errors.school}>
                <input
                  type="text" placeholder="e.g. Royal College, Colombo"
                  value={form.school} onChange={e => set('school', e.target.value)}
                  className={errors.school ? s.inputErr : ''}
                />
              </Field>
            </div>

            <div className={s.row2}>
              <Field label="District" required error={errors.district}>
                <select
                  value={form.district} onChange={e => set('district', e.target.value)}
                  className={errors.district ? s.inputErr : ''}
                >
                  <option value="">Select district…</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Grade / Year" error={errors.gradeYear}>
                <input
                  type="text" placeholder="e.g. Grade 10 / Year 2"
                  value={form.gradeYear} onChange={e => set('gradeYear', e.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          {/* ── Section 3: Participation ─────────────────── */}
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>
              <span className={s.legendNum}>3</span> Participation Details
            </legend>

            <div className={s.row2}>
              <Field label="Category" required error={errors.category}>
                <select
                  value={form.category} onChange={e => set('category', e.target.value)}
                  className={errors.category ? s.inputErr : ''}
                >
                  <option value="">Select category…</option>
                  <option value="School Student (Age 11–15)">School Student (Age 11–15)</option>
                  <option value="University Student">University Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="I want to…" required error={errors.participationType}>
                <select
                  value={form.participationType} onChange={e => set('participationType', e.target.value)}
                  className={errors.participationType ? s.inputErr : ''}
                >
                  <option value="">Select type…</option>
                  <option value="Participate in a WLL session">Participate in a WLL session</option>
                  <option value="Volunteer to teach WLL">Volunteer to teach WLL</option>
                  <option value="Enter the Art Competition">Enter the Art Competition</option>
                  <option value="Both volunteer and compete">Both volunteer and compete</option>
                </select>
              </Field>
            </div>

            <div className={s.row}>
              <Field label="SDG I'm most passionate about (optional)">
                <select value={form.sdgInterest} onChange={e => set('sdgInterest', e.target.value)}>
                  <option value="">Select an SDG…</option>
                  {SDGS.map(g => (
                    <option key={g.n} value={`SDG ${g.n}: ${g.t}`}>SDG {g.n}: {g.t}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className={s.row}>
              <Field label="Anything else you'd like to tell us? (optional)">
                <textarea
                  rows={3} placeholder="Questions, special requirements, how you heard about WLL…"
                  value={form.message} onChange={e => set('message', e.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          {/* Error alert */}
          {status === 'error' && (
            <div className={s.errorAlert}>
              ⚠️ Submission failed. Please check your internet connection and try again, or contact us at 070 150 6924.
            </div>
          )}

          <div className={s.submitRow}>
            <p className={s.privacyNote}>
              🔒 Your information is collected solely for WLL 2026 coordination and will not be shared with third parties.
            </p>
            <button type="submit" disabled={status === 'sending'} className={s.submitBtn}>
              {status === 'sending' ? (
                <><span className={s.spinner}/>Submitting…</>
              ) : (
                'Submit Registration →'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer strip */}
      <div className={s.footerStrip}>
        © 2026 World's Largest Lesson · Sri Lanka · AIESEC · #WLL2026
      </div>
    </div>
  );
}

/* Reusable field wrapper */
function Field({ label, required, error, children }) {
  return (
    <label style={{display:'flex',flexDirection:'column',gap:6}}>
      <span style={{fontWeight:700,fontSize:'.8rem',letterSpacing:'.05em',textTransform:'uppercase',color: error ? '#c0392b' : '#4A5568'}}>
        {label}{required && <span style={{color:'#E5243B',marginLeft:3}}>*</span>}
      </span>
      {children}
      {error && <span style={{fontSize:'.8rem',color:'#c0392b',fontWeight:700}}>{error}</span>}
    </label>
  );
}

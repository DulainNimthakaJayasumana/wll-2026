import { useState } from 'react';
import s from './RunRegister.module.css';

/* ── Replace this with your Google Forms action URL ─────────
   1. Create a Google Form for the run registration
   2. Open DevTools → Network, submit the form once
   3. Copy the POST URL (ends in /formResponse)
   4. Paste it below replacing the placeholder
   ────────────────────────────────────────────────────────── */
const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_ACTION_URL_HERE';

/* Map each field name to the Google Form entry IDs
   e.g. 'entry.1234567890' — get these from the form source */
const ENTRY = {
  name:    'entry.NAME_ENTRY_ID',
  email:   'entry.EMAIL_ENTRY_ID',
  phone:   'entry.PHONE_ENTRY_ID',
  school:  'entry.SCHOOL_ENTRY_ID',
  grade:   'entry.GRADE_ENTRY_ID',
  size:    'entry.TSHIRT_SIZE_ENTRY_ID',
  sdg:     'entry.SDG_ENTRY_ID',
  message: 'entry.MESSAGE_ENTRY_ID',
};

const SIZES = ['XS','S','M','L','XL','XXL'];
const SDGS  = [
  'SDG 1 — No Poverty','SDG 2 — Zero Hunger','SDG 3 — Good Health',
  'SDG 4 — Quality Education','SDG 5 — Gender Equality','SDG 6 — Clean Water',
  'SDG 7 — Clean Energy','SDG 8 — Decent Work','SDG 9 — Industry & Innovation',
  'SDG 10 — Reduced Inequalities','SDG 11 — Sustainable Cities',
  'SDG 12 — Responsible Consumption','SDG 13 — Climate Action',
  'SDG 14 — Life Below Water','SDG 15 — Life on Land',
  'SDG 16 — Peace & Justice','SDG 17 — Partnerships',
];

export default function RunRegister({ onBack }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', school:'', grade:'', size:'M', sdg:'', message:'' });
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    const body = new FormData();
    body.append(ENTRY.name,    form.name);
    body.append(ENTRY.email,   form.email);
    body.append(ENTRY.phone,   form.phone);
    body.append(ENTRY.school,  form.school);
    body.append(ENTRY.grade,   form.grade);
    body.append(ENTRY.size,    form.size);
    body.append(ENTRY.sdg,     form.sdg);
    body.append(ENTRY.message, form.message);
    try {
      await fetch(GOOGLE_FORM_URL, { method:'POST', body, mode:'no-cors' });
    } catch (_) { /* no-cors always throws — treat as success */ }
    setStatus('done');
  };

  if (status === 'done') return (
    <div className={s.page}>
      <div className={s.successWrap}>
        <div className={s.successIcon}>🎽</div>
        <h2>You're Registered!</h2>
        <p>Thanks <strong>{form.name}</strong>! You're officially on the list for Miles for Lesson 2026.</p>
        <p className={s.successNote}>Your free T-shirt (size <strong>{form.size}</strong>) will be ready for collection at Race Course Grounds on 11 July. See you at the starting line! 🏁</p>
        <div className={s.successMeta}>
          <span>📅 Saturday, 11 July 2026</span>
          <span>⏰ 4:30 PM</span>
          <span>📍 Race Course Grounds, Colombo 07</span>
        </div>
        <button onClick={onBack} className={s.backHome}>← Back to Miles for Lesson</button>
      </div>
    </div>
  );

  return (
    <div className={s.page}>

      {/* Back */}
      <button className={s.backBtn} onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      {/* Header */}
      <div className={s.header}>
        <div className={s.headerBadge}>
          <span className={s.pulseDot}/>
          <span>AIESEC in Sri Lanka · WLL 2026</span>
        </div>
        <div className={s.headerIcon}>🏃</div>
        <h1>Register for<br/><span>Miles for Lesson</span></h1>
        <p>Saturday, 11 July 2026 · 4:30 PM · Race Course Grounds, Colombo 07</p>
        <div className={s.freeBadge}>🎽 Free T-Shirt Included with Registration!</div>
      </div>

      {/* Form */}
      <div className={s.formWrap}>
        <form onSubmit={handleSubmit} className={s.form}>

          <div className={s.formGrid}>
            <div className={s.field}>
              <label>Full Name <span>*</span></label>
              <input required value={form.name} onChange={set('name')} placeholder="Your full name" />
            </div>
            <div className={s.field}>
              <label>Email Address <span>*</span></label>
              <input required type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
            </div>
            <div className={s.field}>
              <label>Phone Number <span>*</span></label>
              <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="07X XXX XXXX" />
            </div>
            <div className={s.field}>
              <label>School / University / Organisation <span>*</span></label>
              <input required value={form.school} onChange={set('school')} placeholder="Name of your institution" />
            </div>
            <div className={s.field}>
              <label>Grade / Year</label>
              <input value={form.grade} onChange={set('grade')} placeholder="e.g. Grade 10, Year 2, Working" />
            </div>
            <div className={s.field}>
              <label>T-Shirt Size <span>*</span></label>
              <select required value={form.size} onChange={set('size')}>
                {SIZES.map(sz => <option key={sz} value={sz}>{sz}</option>)}
              </select>
              <span className={s.fieldHint}>Free exclusive SDG-themed T-shirt for all registered participants</span>
            </div>
          </div>

          <div className={s.field}>
            <label>Favourite SDG</label>
            <select value={form.sdg} onChange={set('sdg')}>
              <option value="">Select an SDG (optional)</option>
              {SDGS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className={s.field}>
            <label>Anything else you'd like to tell us?</label>
            <textarea value={form.message} onChange={set('message')} rows={3} placeholder="Medical conditions, special requirements, shoutouts..." />
          </div>

          {/* T-shirt reminder */}
          <div className={s.tshirtReminder}>
            <span>🎽</span>
            <div>
              <strong>Your Free T-Shirt</strong>
              <p>An exclusive SDG-themed Miles for Lesson T-shirt is included free with your registration. Collect it at the race-day registration desk at Race Course Grounds.</p>
            </div>
          </div>

          <button type="submit" disabled={status === 'sending'} className={s.submitBtn}>
            {status === 'sending' ? (
              <><span className={s.spinner}/> Registering…</>
            ) : (
              <>🏁 Register for Miles for Lesson 2026</>
            )}
          </button>

          <p className={s.terms}>By registering you agree to participate safely and follow event marshal instructions. This event is free and open to all.</p>
        </form>
      </div>

    </div>
  );
}

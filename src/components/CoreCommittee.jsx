import { useState } from 'react';
import s from './CoreCommittee.module.css';

/* ════════════════════════════════════════════════════════════
   TEAM DATA
   ─────────────────────────────────────────────────────────
   • linkedin : replace '#' with full LinkedIn profile URL
   • image    : drop the photo into  public/assets/team/
                and update the filename here (e.g. 'pasindu.jpg')
                Leave as '' to show the coloured initials avatar
   ════════════════════════════════════════════════════════════ */
const TEAM = [
  /* ── Leadership ─────────────────────────────────────────── */
  {
    dept: 'Leadership', color: '#19486A',
    members: [
      { name:'Pasindu',   role:'CCP',        linkedin:'#', image:'pasindu.jpg',   initials:'P',  color:'#F89B29' },
      { name:'Dineth',    role:'FIN · CCVP', linkedin:'#', image:'dineth.jpg',    initials:'D',  color:'#4C9F38' },
    ],
  },
  /* ── NM – Schools ───────────────────────────────────────── */
  {
    dept: 'NM – Schools', color: '#3F7E44',
    members: [
      { name:'Ishini',    role:'CCVP',   linkedin:'#', image:'ishini.jpg',    initials:'I',  color:'#3F7E44' },
      { name:'Dewni',     role:'Member', linkedin:'#', image:'dewni.jpg',     initials:'D',  color:'#56C02B' },
      { name:'Chanuli',   role:'Member', linkedin:'#', image:'chanuli.jpg',   initials:'Ch', color:'#4C9F38' },
      { name:'Merushika', role:'Member', linkedin:'#', image:'merushika.jpg', initials:'M',  color:'#56C02B' },
      { name:'Imanga',    role:'Member', linkedin:'#', image:'imanga.jpg',    initials:'Im', color:'#3F7E44' },
    ],
  },
  /* ── NM – SE ────────────────────────────────────────────── */
  {
    dept: 'NM – SE', color: '#E5243B',
    members: [
      { name:'Tanuri',    role:'CCVP',   linkedin:'#', image:'tanuri.jpg',    initials:'T',  color:'#E5243B' },
      { name:'Minindi',   role:'Member', linkedin:'#', image:'minindi.jpg',   initials:'Mi', color:'#C5192D' },
      { name:'Sandupama', role:'Member', linkedin:'#', image:'sandupama.jpg', initials:'Sa', color:'#E5243B' },
    ],
  },
  /* ── NM – LOG ───────────────────────────────────────────── */
  {
    dept: 'NM – LOG', color: '#19486A',
    members: [
      { name:'Gamindu',     role:'CCVP',   linkedin:'#', image:'gamindu.jpg',     initials:'G',  color:'#19486A' },
      { name:'Pakeetharan', role:'Member', linkedin:'#', image:'pakeetharan.jpg', initials:'Pk', color:'#00689D' },
      { name:'Yehan',       role:'Member', linkedin:'#', image:'yehan.jpg',       initials:'Y',  color:'#0A97D9' },
      { name:'Buddhima',    role:'Member', linkedin:'#', image:'buddhima.jpg',    initials:'Bu', color:'#19486A' },
      { name:'Jamindu',     role:'Member', linkedin:'#', image:'jamindu.jpg',     initials:'J',  color:'#00689D' },
    ],
  },
  /* ── Marketing ──────────────────────────────────────────── */
  {
    dept: 'Marketing', color: '#FCC30B',
    members: [
      { name:'Binali',    role:'CCVP',   linkedin:'www.linkedin.com/in/binali-gajamange-572949231', image:'binali.jpg',    initials:'Bi', color:'#FCC30B' },
      { name:'Ashdaaq',   role:'Member', linkedin:'www.linkedin.com/in/ashfaaq-ashrak', image:'ashdaaq.jpg',   initials:'A',  color:'#DDA63A' },
      { name:'Chrishane', role:'Member', linkedin:'www.linkedin.com/in/chrishane-dimuthu', image:'chrishane.jpg', initials:'C',  color:'#FCC30B' },
      { name:'Dulain',    role:'Member', linkedin:'www.linkedin.com/in/dulain-jayasumana', image:'dulain.jpg',    initials:'Du', color:'#BF8B2E' },
      { name:'Isira',     role:'Member', linkedin:'www.linkedin.com/in/isira-fernando-353325283', image:'isira.jpg',     initials:'Is', color:'#DDA63A' },
    ],
  },
  /* ── PR ─────────────────────────────────────────────────── */
  {
    dept: 'PR', color: '#FD6925',
    members: [
      { name:'Flemin',      role:'CCVP',   linkedin:'#', image:'flemin.jpg',      initials:'F',  color:'#FD6925' },
      { name:'Christle',    role:'Member', linkedin:'#', image:'christle.jpg',    initials:'Ch', color:'#FD9D24' },
      { name:'Sachinthani', role:'Member', linkedin:'#', image:'sachinthani.jpg', initials:'Sa', color:'#FD6925' },
      { name:'Kalindu',     role:'Member', linkedin:'#', image:'kalindu.jpg',     initials:'K',  color:'#FD9D24' },
    ],
  },
  /* ── RnD ────────────────────────────────────────────────── */
  {
    dept: 'RnD', color: '#DD1367',
    members: [
      { name:'Jayathri', role:'CCVP',   linkedin:'#', image:'jayathri.jpg', initials:'Ja', color:'#DD1367' },
      { name:'Isthikar', role:'Member', linkedin:'#', image:'isthikar.jpg', initials:'It', color:'#A21942' },
      { name:'Matheen',  role:'Member', linkedin:'#', image:'matheen.jpg',  initials:'Ma', color:'#DD1367' },
    ],
  },
  /* ── HR ─────────────────────────────────────────────────── */
  {
    dept: 'HR', color: '#26BDE2',
    members: [
      { name:'Lahirunie', role:'CCVP',   linkedin:'#', image:'lahirunie.jpg', initials:'L',  color:'#26BDE2' },
      { name:'Chenuli',   role:'Member', linkedin:'#', image:'chenuli.jpg',   initials:'Ch', color:'#0A97D9' },
      { name:'Sandaru',   role:'Member', linkedin:'#', image:'sandaru.jpg',   initials:'Sa', color:'#26BDE2' },
    ],
  },
  /* ── Partnership Development ────────────────────────────── */
  {
    dept: 'Partnership Dev', color: '#A21942',
    members: [
      { name:'Varun',    role:'CCVP',    linkedin:'#', image:'varun.jpg',    initials:'V',  color:'#A21942' },
      { name:'Rashmika', role:'Member',  linkedin:'#', image:'rashmika.jpg', initials:'R',  color:'#DD1367' },
      { name:'Kavishva', role:'Member',  linkedin:'#', image:'kavishva.jpg', initials:'Ka', color:'#A21942' },
      { name:'Thisuli',  role:'Member',  linkedin:'#', image:'thisuli.jpg',  initials:'Th', color:'#C5192D' },
      { name:'Binithi',  role:'Member',  linkedin:'#', image:'binithi.jpg',  initials:'Bi', color:'#DD1367' },
    ],
  },
];

/* ── Avatar — shows photo if file exists, else initials ───── */
function Avatar({ person, size }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasPhoto = person.image && !imgFailed;
  const src = `/assets/team/${person.image}`;

  return (
    <div
      className={`${s.avatar} ${s[size]}`}
      style={hasPhoto ? {} : { background: person.color }}
    >
      {hasPhoto ? (
        <img
          src={src}
          alt={person.name}
          onError={() => setImgFailed(true)}
          className={s.avatarImg}
        />
      ) : (
        <span className={s.initials}>{person.initials}</span>
      )}
    </div>
  );
}

/* ── Person card ─────────────────────────────────────────── */
function PersonCard({ person, size = 'md' }) {
  const isLink = person.linkedin && person.linkedin !== '#';
  const Tag    = isLink ? 'a' : 'div';
  const props  = isLink ? { href: person.linkedin, target:'_blank', rel:'noopener noreferrer' } : {};

  return (
    <Tag className={`${s.person} ${s[size]} ${isLink ? s.personLink : ''}`} {...props} title={isLink ? `${person.name} on LinkedIn` : `${person.name} — LinkedIn coming soon`}>
      <div className={s.avatarWrap}>
        <Avatar person={person} size={size} />
        <div className={`${s.liIcon} ${isLink ? s.liActive : s.liSoon}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
      </div>
      <div className={s.personName}>{person.name}</div>
      <div className={s.personRole}>{person.role}</div>
    </Tag>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function CoreCommittee() {
  const leadership  = TEAM[0];
  const departments = TEAM.slice(1);

  return (
    <section className={s.section} id="contact">
      <div className="shell">

        {/* Header */}
        <div className={`reveal ${s.header}`}>
          <div className={s.colorStrips}>
            {['#E5243B','#DDA63A','#4C9F38','#26BDE2','#FCC30B','#FD6925','#DD1367','#19486A'].map(c=>(
              <span key={c} style={{background:c}}/>
            ))}
          </div>
          <h2 className={s.title}>
            <span className={s.titleCore}>Core</span>
            <span className={s.titleCommittee}>Committee</span>
          </h2>
          <p className={s.subtitle}>Islandwide World's Largest Lesson 2026</p>
          <p className={s.subtitleSub}>The team making it happen · Organised by AIESEC in Sri Lanka</p>
        </div>

        {/* Leadership */}
        <div className={`reveal ${s.leadership}`}>
          {leadership.members.map(p=>(
            <PersonCard key={p.name} person={p} size="lg"/>
          ))}
        </div>

        {/* Department grid */}
        <div className={s.grid}>
          {departments.map((dept,di)=>(
            <div key={dept.dept} className={`reveal d${(di%4)+1} ${s.card}`}>
              <div className={s.cardHeader} style={{background:dept.color}}>
                <span className={s.deptName}>{dept.dept}</span>
              </div>
              <div className={s.cardBody}>
                <div className={s.ccvpRow}>
                  <PersonCard person={dept.members[0]} size="sm"/>
                </div>
                {dept.members.length > 1 && (
                  <div className={s.membersRow}>
                    <span className={s.membersLabel}>Members</span>
                    <div className={s.membersList}>
                      {dept.members.slice(1).map(p=>(
                        <PersonCard key={p.name} person={p} size="xs"/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions note */}
        <div className={`reveal ${s.note}`}>
          <div className={s.noteInner}>
            <svg viewBox="0 0 24 24" fill="#0A66C2" width="18" height="18">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn profiles coming soon — click any card to connect with the team</span>
          </div>
        </div>

      </div>
    </section>
  );
}

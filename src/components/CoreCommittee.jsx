import { useState } from 'react';
import s from './CoreCommittee.module.css';

// Load all team images from src/assets/team (Vite) and map by filename
const teamImageModules = import.meta.glob('../assets/team/*.{jpg,jpeg,png,JPG,JPEG,PNG,webp,WEBP}', { eager: true });
const TEAM_IMAGES = Object.fromEntries(
  Object.entries(teamImageModules).map(([path, mod]) => {
    const name = path.split('/').pop();
    return [name, mod.default];
  })
);

function resolveTeamImage(spec, personName) {
  if (!spec && !personName) return null;
  // if spec already looks like an external URL or absolute path, use it directly
  if (typeof spec === 'string' && (spec.includes('://') || spec.startsWith('/'))) return spec;
  // try exact filename
  if (typeof spec === 'string' && TEAM_IMAGES[spec]) return TEAM_IMAGES[spec];
  // if spec looks like a path (contains slash) but wasn't an external URL, try basename
  if (typeof spec === 'string' && spec.includes('/')) {
    const name = spec.split('/').pop();
    if (TEAM_IMAGES[name]) return TEAM_IMAGES[name];
  }
  // fallback: match by person name in filenames (case-insensitive)
  if (personName) {
    const key = Object.keys(TEAM_IMAGES).find(k => k.toLowerCase().includes(personName.toLowerCase().replace(/\s+/g, ''))
      || k.toLowerCase().includes(personName.toLowerCase())
    );
    if (key) return TEAM_IMAGES[key];
  }
  return null;
}

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
      { name:'Pasindu',   role:'CCP',        linkedin:'https://www.linkedin.com/in/pasindu-serasinghe-0090a2216?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', image:'Pasindu.webp',   initials:'P',  color:'#F89B29' },
      { name:'Dineth',    role:'FIN · CCVP', linkedin:'https://www.linkedin.com/in/dineth-samarawickrama-356285290', image:'Dineth Samarawickrama.webp',    initials:'D',  color:'#4C9F38' },
    ],
  },
  /* ── NM – Schools ───────────────────────────────────────── */
  {
    dept: 'NM – Schools', color: '#3F7E44',
    members: [
      { name:'Ishini',    role:'CCVP',   linkedin:'https://www.linkedin.com/in/ishini-higgoda/', image:'Ishini.webp',    initials:'I',  color:'#3F7E44' },
      { name:'Dewni',     role:'Member', linkedin:'https://www.linkedin.com/in/dewni-premadasa-16a391397', image:'Dewni Premadasa - Dewni Premadasa.webp',     initials:'D',  color:'#56C02B' },
      { name:'Chanuli',   role:'Member', linkedin:'https://www.linkedin.com/in/chanuli-janusha-randunu-pathirana-0aaa08353', image:'Chanuli - Chanuli Janusha.webp',   initials:'Ch', color:'#4C9F38' },
      { name:'Merushika', role:'Member', linkedin:'https://www.linkedin.com/in/merushika-alahakoon-6a2085395/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BMd0fGyMMQCaByRBsHjXVoA%3D%3D', image:'Merushika Alahakoon - Merushika Alahakoon (1).webp', initials:'M',  color:'#56C02B' },
      { name:'Imanga',    role:'Member', linkedin:'https://www.linkedin.com/in/imanga-nethmini-734892333', image:'Imanga Nethmini - Imanga Nethmini.webp',    initials:'Im', color:'#3F7E44' },
    ],
  },
  /* ── NM – SE ────────────────────────────────────────────── */
  {
    dept: 'NM – SE', color: '#E5243B',
    members: [
      { name:'Tanuri',    role:'CCVP',   linkedin:'https://www.linkedin.com/in/tanuri-dissanayaka-356285290', image:'Tanuri Dissanayaka.webp',    initials:'T',  color:'#E5243B' },
      { name:'Minindi',   role:'Member', linkedin:'https://www.linkedin.com/in/minindi-fonseka-5b080123b', image:'Minindi_Fonseka - Minindi Fonseka.webp',   initials:'Mi', color:'#C5192D' },
      { name:'Sandupama', role:'Member', linkedin:'https://www.linkedin.com/in/sandupama-bandara-72483a300', image:'Sandupama Bandara - Sandupama Bandara.webp', initials:'Sa', color:'#E5243B' },
    ],
  },
  /* ── NM – LOG ───────────────────────────────────────────── */
  {
    dept: 'NM – LOG', color: '#19486A',
    members: [
      { name:'Gamindu',     role:'CCVP',   linkedin:'https://www.linkedin.com/in/gamidu-welikanna-61ba4924b/', image:'Gamidu_Welikanna.webp',     initials:'G',  color:'#19486A' },
      { name:'Pakeetharan', role:'Member', linkedin:'https://www.linkedin.com/in/balamurali-pakeetharan-385580287', image:'Balamurali Pakeetharan - Balamurali Pakeetharan.webp', initials:'Pk', color:'#00689D' },
      { name:'Yehan',       role:'Member', linkedin:'https://www.linkedin.com/in/yehan-de-silva-96aa97359/', image:'Yehan De Silva - Yehan De Silva.webp',       initials:'Y',  color:'#0A97D9' },
      { name:'Buddhima',    role:'Member', linkedin:'https://www.linkedin.com/in/buddhima-pathiraja-73b98021a', image:'D - Buddhima Pathiraja.Buddhima Pathiraja_.webp',    initials:'Bu', color:'#19486A' },
      { name:'Jamindu',     role:'Member', linkedin:'https://www.linkedin.com/in/janindu-arandara-826511358', image:'WhatsApp Image 2026-04-04 at 14.37.41 - Janindu Arandara.webp',     initials:'J',  color:'#00689D' },
    ],
  },
  /* ── Marketing ──────────────────────────────────────────── */
  {
    dept: 'Marketing', color: '#FCC30B',
    members: [
      { name:'Binali',    role:'CCVP',   linkedin:'https://www.linkedin.com/in/binali-gajamange-572949231', image:'Binali_Gajamange_SLIIT.webp',    initials:'Bi', color:'#FCC30B' },
      { name:'Ashfaaq',   role:'Member', linkedin:'https://www.linkedin.com/in/ashfaaq-ashrak', image:'Ashfaaq Ashrak - Ashfaaq Ashrak.webp',   initials:'A',  color:'#DDA63A' },
      { name:'Chrishane', role:'Member', linkedin:'https://www.linkedin.com/in/chrishane-dimuthu/', image:'Chrishane_Dimuthu - Dimuthu Chrishane.webp', initials:'C',  color:'#FCC30B' },
      { name:'Dulain',    role:'Member', linkedin:'https://www.linkedin.com/in/dulain-jayasumana', image:'USJ_Dulain _Jayasumana - Dulain Jayasumana.webp',    initials:'Du', color:'#BF8B2E' },
      { name:'Isira',     role:'Member', linkedin:'https://www.linkedin.com/in/isira-fernando-353325283', image:'Isira fernando - Fernando Isira.webp',     initials:'Is', color:'#DDA63A' },
    ],
  },
  /* ── PR ─────────────────────────────────────────────────── */
  {
    dept: 'PR', color: '#FD6925',
    members: [
      { name:'Flemin',      role:'CCVP',   linkedin:'https://www.linkedin.com/in/flemin-fernando-356285290', image:'Flemin_Fernando.webp',      initials:'F',  color:'#FD6925' },
      { name:'Christle',    role:'Member', linkedin:'https://www.linkedin.com/in/christle-salgado-356285290', image:'6B1CD28D-5572-4691-BBAD-915AB1ACE2AD - Christle Salgado.webp',    initials:'Ch', color:'#FD9D24' },
      { name:'Sachinthani', role:'Member', linkedin:'https://www.linkedin.com/in/sachinthani-ketakumbura-', image:'Sachinthani Ketakumbura (2) - Ketakumbura Sachinthani.webp', initials:'Sa', color:'#FD6925' },
      { name:'Kalindu',     role:'Member', linkedin:'https://www.linkedin.com/in/kalindu-de-silva-372808348', image:'Kalindu_DeSilva - Kalindu De Silva.webp',     initials:'K',  color:'#FD9D24' },
    ],
  },
  /* ── RnD ────────────────────────────────────────────────── */
  {
    dept: 'RnD', color: '#DD1367',
    members: [
      { name:'Jayathri', role:'CCVP',   linkedin:'https://www.linkedin.com/in/jayathri-wijewardana', image:'Jayathri Wijewardana.webp', initials:'Ja', color:'#DD1367' },
      { name:'Isthikar', role:'Member', linkedin:'https://www.linkedin.com/in/fathimaisthikar', image:'Fathima_Isthikar - Isthikar Fathima.webp', initials:'It', color:'#A21942' },
      { name:'Matheen',  role:'Member', linkedin:'https://www.linkedin.com/in/matheen-amm', image:'Kandy_Matheen_Mohammed - Matheen Mohammed.webp',  initials:'Ma', color:'#DD1367' },
    ],
  },
  /* ── HR ─────────────────────────────────────────────────── */
  {
    dept: 'HR', color: '#26BDE2',
    members: [
      { name:'Lahirunie', role:'CCVP',   linkedin:'https://www.linkedin.com/in/lahirunie-dulsara-88a6592a9', image:'Lahirunie Dulsara.webp', initials:'L',  color:'#26BDE2' },
      { name:'Chenuli',   role:'Member', linkedin:'https://www.linkedin.com/in/chenuli-ranaweera-356285290', image:'Chenuli Ranaweera - Chenuli Ranaweera.webp',   initials:'Ch', color:'#0A97D9' },
      { name:'Sandaru',   role:'Member', linkedin:'https://www.linkedin.com/in/sandaru-yahampath-202ab4296', image:'SANDARU PIC - Sandaru Yahampath.webp',   initials:'Sa', color:'#26BDE2' },
    ],
  },
  /* ── Partnership Development ────────────────────────────── */
  {
    dept: 'Partnership Dev', color: '#A21942',
    members: [
      { name:'Varun',    role:'CCVP',    linkedin:'https://www.linkedin.com/in/varun-poobalaraja', image:'Varun_Bhargav.webp',    initials:'V',  color:'#A21942' },
      { name:'Rashmika', role:'Member',  linkedin:'https://www.linkedin.com/in/rashmika-g-291ab7275', image:'Rashmika Guruge - Guruge Rashmika.webp', initials:'R',  color:'#DD1367' },
      { name:'Kavishva', role:'Member',  linkedin:'https://www.linkedin.com/in/kavishva-nandasena-7469943a9', image:'Kavishva - Kavishva Nandasena.webp', initials:'Ka', color:'#A21942' },
      { name:'Thisuli',  role:'Member',  linkedin:'https://www.linkedin.com/in/thisuli-amanethmi-029761246', image:'Thisuli Amanethmi.webp',  initials:'Th', color:'#C5192D' },
      { name:'Binithi',  role:'Member',  linkedin:'https://www.linkedin.com/in/binithi-ranaweera-3b1898355/', image:'Binithi.webp',  initials:'Bi', color:'#DD1367' },
    ],
  },
];

/* ── Avatar — shows photo if file exists, else initials ───── */
function Avatar({ person, size }) {
  const [imgFailed, setImgFailed] = useState(false);
  const resolved = resolveTeamImage(person.image, person.name);
  const src = resolved || (typeof person.image === 'string' ? `/assets/team/${person.image}` : person.image);
  const hasPhoto = !!src && !imgFailed;

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

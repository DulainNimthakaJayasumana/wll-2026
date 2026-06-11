import s from './About.module.css';

const STATS = [
  { n:17,  suf:'',  label:'Global Goals',         sub:'One blueprint for 2030',        accent:'#E5243B', icon:'🎯' },
  { n:130, suf:'+', label:'Countries Reached',     sub:'A truly global movement',       accent:'#26BDE2', icon:'🌍' },
  { n:15,  suf:'',  label:'Districts in Sri Lanka', sub:'Islandwide reach in 2026',     accent:'#4C9F38', icon:'📍' },
  { n:600, suf:'+', label:'Student Volunteers',    sub:'Across 55–60 schools',          accent:'#FCC30B', icon:'🏫' },
];

const TL = [
  { year:'2015', title:'The Goals are born', body:'193 nations adopt the 17 SDGs. The World\'s Largest Lesson launches alongside them, reaching classrooms on every continent.' },
  { year:'2020', title:'Sri Lanka takes action', body:'AIESEC in Sri Lanka delivers WLL across 49 schools — 268 sessions, 590 volunteers, students aged 9–16.' },
  { year:'2025', title:'The comeback begins', body:'After a 6-year gap, AIESEC in Sri Lanka plans the most ambitious edition yet — fully islandwide.' },
  { year:'2026', title:'Islandwide WLL 2026', body:'15 districts. 55–60 schools. 500–600 volunteers. Ages 11–15. Every student invited to learn, create and act.' },
];

export default function About() {
  return (
    <section className={s.about} id="about">
      <div className="shell">
        <div className={s.grid}>
          <div>
            <div className={`reveal ${s.head}`}>
              <span className={s.eyebrow}>The Initiative</span>
              <h2>What is the<br/>World's Largest Lesson?</h2>
            </div>
            <p className="reveal d1">The <strong>World’s Largest Lesson</strong> is a global education initiative by Project
Everyone that promotes the Sustainable Development Goals (SDGs)
through creative and engaging learning experiences for children and
young people. Working alongside partners such as UNICEF and
UNESCO, WWL has reached millions of students across more than
160 countries since 2015.</p>
            <p className="reveal d2">After a 5-year hiatus, this inspiring initiative is being organized once
again to empower the next generation to create a better and more
sustainable future for all.
</p>
            <p className="reveal d3">AIESEC in Sri Lanka is back. <strong>Islandwide</strong>, reaching 10+ districts across 40+ schools for 30,000+ Students Island Wide.</p>
            <div className="reveal d4" style={{marginTop:32}}>
              <a href="#sdgs" className={s.btn}>Meet the 17 Goals →</a>
            </div>
          </div>
          <div className={`reveal d2 ${s.media}`}>
            <div className={s.mediaInner}>
              <img src="/assets/photos/class-poster-smile.png" alt="WLL lesson in Sri Lanka" />
            </div>
            <span className={s.mediaTag}>A WLL lesson in progress · Sri Lanka</span>
            <div className={s.mediaBadge}><span className={s.badgeNum}>2026</span><span className={s.badgeLbl}>Islandwide</span></div>
          </div>
        </div>

        {/* Stats */}
        <div className={s.stats}>
          {STATS.map((st,i) => (
            <div key={st.label} className={`reveal d${i+1} ${s.stat}`} style={{'--accent':st.accent}}>
              <div className={s.statIcon}>{st.icon}</div>
              <div className={s.statNum}>{st.n}{st.suf}</div>
              <div className={s.statLabel}>{st.label}</div>
              <div className={s.statSub}>{st.sub}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className={s.timeline}>
          {TL.map(t => (
            <div key={t.year} className={`reveal ${s.tlRow}`}>
              <div className={s.tlYear}>{t.year}</div>
              <div className={s.tlBody}><h4>{t.title}</h4><p>{t.body}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

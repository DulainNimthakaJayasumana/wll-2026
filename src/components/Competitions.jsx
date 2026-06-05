import { goToRegister } from '../App';
import s from './Competitions.module.css';

const CARDS = [
  { icon:'🎓', title:'Eligibility',       color:'#FCC30B', items:['Open to students aged 11–15','School & university categories','Individual entries only','Completely free to enter'] },
  { icon:'📋', title:'The Rules',         color:'#E5243B', items:['Artwork must represent one SDG','Any medium: pencil, paint, digital','Must be your own original work','Write the goal number on your piece'] },
  { icon:'📤', title:'How to Submit',     color:'#26BDE2', items:['Photograph or scan your artwork','Upload via the button below','Include your name, school & grade','One entry per student'] },
  { icon:'⭐', title:'Judging Criteria',  color:'#4C9F38', items:['Creativity & originality — 40%','Connection to the SDG — 35%','Visual impact — 25%','Judged by our WLL panel'] },
];

export default function Competitions() {
  return (
    <section className={s.comp} id="competitions">
      <div className="shell">
        <div className={`reveal ${s.head}`}>
          <span className={s.eyebrow}>Take Action</span>
          <h2>The WLL 2026<br/>Art Competition</h2>
          <p>Pick a Global Goal that matters to you and <strong>draw it</strong>. Show us your vision of a better Sri Lanka — every entry teaches the whole island something new.</p>
          <div className={s.theme}><span className={s.pill}>Theme</span> Draw your Sustainable Development Goal</div>
        </div>

        <div className={s.cards}>
          {CARDS.map((c,i) => (
            <div key={c.title} className={`reveal d${i+1} ${s.card}`} style={{'--card':c.color}}>
              <div className={s.cardIcon}>{c.icon}</div>
              <h4>{c.title}</h4>
              <ul>{c.items.map(it=><li key={it}>{it}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className={`reveal ${s.submit}`}>
          <div className={s.submitInner}>
            <h3>Ready to share your vision?</h3>
            <p>Upload your artwork to our official submission folder. Name your file with your full name and school.</p>
            <button className={s.submitBtn} onClick={goToRegister}>Register &amp; Submit Entry →</button>
            <div className={s.note}>Deadline: 31 August 2026 · Winners announced at WLL 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}

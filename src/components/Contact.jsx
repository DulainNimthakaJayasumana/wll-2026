import s from './Contact.module.css';

const CARDS = [
  { icon:'📞', label:'Call / WhatsApp', value:'070 150 6924',         href:'tel:0701506924' },
  { icon:'📸', label:'Instagram',        value:'@wll.srilanka',       href:'https://instagram.com/wll.srilanka' },
  { icon:'👤', label:'Project Coordinator', value:'Dulain Jayasumana' },
  { icon:'🏢', label:'Organised by',    value:'AIESEC in Sri Lanka' },
];

export default function Contact() {
  return (
    <section className={s.contact} id="contact">
      <div className="shell">
        <div className={`reveal ${s.head}`}>
          <span className={s.eyebrow}>Get in Touch</span>
          <h2>Questions? We're here<br/>to help you take part.</h2>
        </div>
        <div className={s.grid}>
          <div>
            {CARDS.map((c,i) => {
              const inner = (
                <>
                  <span className={s.ic}>{c.icon}</span>
                  <span className={s.text}>
                    <span className={s.k}>{c.label}</span>
                    <span className={s.v}>{c.value}</span>
                  </span>
                  {c.href && <span className={s.arrow}>→</span>}
                </>
              );
              return c.href
                ? <a key={c.label} className={`reveal d${i+1} ${s.card}`} href={c.href} target={c.href.startsWith('http')?'_blank':undefined} rel="noopener">{inner}</a>
                : <div key={c.label} className={`reveal d${i+1} ${s.card}`}>{inner}</div>;
            })}
          </div>
          <div className={`reveal d2 ${s.panel}`}>
            <h3>Be part of the world's largest classroom.</h3>
            <p>Follow us for lesson dates, competition updates and stories from students taking action across all 15 districts of Sri Lanka.</p>
            <a href="#competitions" className={s.panelBtn}>Enter the Competition</a>
          </div>
        </div>
      </div>
    </section>
  );
}

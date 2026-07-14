import s from './BrandAmbassadors.module.css';

/* pos = object-position tuned per photo (x% y%) */
const AMBASSADORS = [
  { name: 'Udani Senanayake',     title: 'Miss Sri Lanka Earth 2022 · Miss Supermodel Worldwide 2026',                    initials: 'US', color: '#E5243B', photo: '/assets/ambassadors/udani.jpeg',     pos: '50% 8%'  },
  { name: 'Sade Greenwood',       title: 'Miss World Sri Lanka 2021 · Radio Presenter · Model',                           initials: 'SG', color: '#FD6925', photo: '/assets/ambassadors/sade.jpeg',      pos: '50% 5%'  },
  { name: 'Subhashi Tania',       title: 'Climate Journalist',                                                            initials: 'ST', color: '#FCC30B', photo: '/assets/ambassadors/subhashi.jpeg',  pos: '50% 8%'  },
  { name: 'Senuri Rupasinghe',    title: 'Volunteer · Advocate · Hybrid Athlete',                                         initials: 'SR', color: '#4C9F38', photo: '/assets/ambassadors/senuri.jpeg',    pos: '50% 5%'  },
  { name: 'Dr. Anoka Abeyrathne', title: 'Social Entrepreneur · Regional Coordinator, Royal Commonwealth Society',        initials: 'DA', color: '#26BDE2', photo: '/assets/ambassadors/dr-anoka.jpeg',  pos: '50% 12%' },
  { name: 'Yuneth Wijenayake',    title: 'Co-Founder & Director of Technology, The Climate Intelligence Network',         initials: 'YW', color: '#19486A', photo: '/assets/ambassadors/yuneth.jpeg',    pos: '50% 8%'  },
  { name: 'Kyle Abeysinghe',      title: '2024 Olympian · Swimmer · Mental Health Advocate',                              initials: 'KA', color: '#A21942', photo: '/assets/ambassadors/kyle.webp',       pos: '50% 20%' },
  { name: 'Chamanthi Bandara',    title: 'Marketer · Miss Universe Sri Lanka 4th Runner-Up 2024',                         initials: 'CB', color: '#DD1367', photo: '/assets/ambassadors/chamanthi.jpeg',  pos: '50% 5%'  },
  { name: 'Belinda Seneviratne',  title: 'Humanitarian · Model',                                                          initials: 'BS', color: '#0A97D9', photo: '/assets/ambassadors/belinda.jpeg',   pos: '50% 10%' },
];

export default function BrandAmbassadors() {
  return (
    <section className={s.section} id="ambassadors">
      <div className={`shell ${s.inner}`}>
        <div className={s.head}>
          <span className={s.eyebrow}>🌟 WLL 2026</span>
          <h2 className={s.title}>Brand Ambassadors</h2>
          <p className={s.sub}>
            Inspiring changemakers championing the World's Largest Lesson and the
            UN Sustainable Development Goals across Sri Lanka.
          </p>
        </div>

        <div className={s.grid}>
          {AMBASSADORS.map((a, i) => (
            <div key={i} className={s.card} style={{ '--ac': a.color }}>
              {a.photo
                ? <img className={s.photo} src={a.photo} alt={a.name} style={{ objectPosition: a.pos }} />
                : <div className={s.initials}>{a.initials}</div>
              }
              <div className={s.overlay}>
                <span className={s.name}>{a.name}</span>
                <span className={s.role}>{a.title}</span>
              </div>
              <div className={s.bar} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

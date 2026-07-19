import { useState, useRef, useEffect, useCallback } from 'react';
import { SDGS } from '../../data/sdgs';
import s from './Chatbot.module.css';

/* ── Event facts used by local replies (aligned with current pages) ───────── */
const EVENT = {
  scope: 'WLL 2026 in Sri Lanka targets 10+ districts, 40+ schools, and 30,000+ students islandwide.',
  run: {
    name: 'Miles for Lessons',
    date: 'Saturday, 11 July 2026',
    time: '4:30 PM',
    place: 'Race Course Grounds, Colombo 07',
    distance: 'about 5 km',
    fee: 'Rs. 1,800 per person',
    perks: 'race bib + official WLL t-shirt',
  },
  volunteer: {
    date: '3 August 2026',
    age: '18-30 years',
    fee: 'free',
  },
  competition: {
    age: '11-15 years',
    deadline: '31 August 2026',
    fee: 'free',
  },
  contact: {
    phone: '070 150 6924',
    instagram: '@wll.srilanka',
    email: 'wll26coreteam@aiesec.net',
  },
};

const KB = {
  greet: ['hi', 'hello', 'hey', 'ayubowan', 'vanakkam'],
  thanks: ['thanks', 'thank you', 'thx', 'appreciate'],
  smallTalk: ['how are you', 'who are you', 'your name'],
  wll: ['wll', 'world largest lesson', 'what is wll'],
  sdg: ['sdg', 'goal', 'sustainable development'],
  run: ['run', 'miles for lesson', 'miles for lessons', 'race'],
  comp: ['competition', 'art', 'draw', 'submit', 'entry'],
  volunteer: ['volunteer', 'join', 'participate', 'help'],
  contact: ['contact', 'phone', 'instagram', 'reach', 'call', 'whatsapp', 'email'],
  scope: ['district', 'districts', 'school', 'schools', 'students', 'islandwide', 'coverage', 'covered', 'reach'],
};

const SDG_ALIASES = {
  poverty: 1,
  hunger: 2,
  health: 3,
  education: 4,
  gender: 5,
  water: 6,
  energy: 7,
  work: 8,
  innovation: 9,
  inequality: 10,
  cities: 11,
  consumption: 12,
  climate: 13,
  ocean: 14,
  land: 15,
  peace: 16,
  partnership: 17,
};

const DETAIL_HINTS = ['more', 'detail', 'explain', 'elaborate', 'why', 'how', 'tell me more'];

const escapeRe = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasAny = (txt, keys) => keys.some(k => {
  const key = k.toLowerCase();
  if (key.includes(' ')) return txt.includes(key);
  const re = new RegExp(`(^|\\b)${escapeRe(key)}(\\b|$)`, 'i');
  return re.test(txt);
});

function findSDG(ql) {
  const direct = ql.match(/(?:sdg|goal)\s*(\d{1,2})/i) || ql.match(/\b(\d{1,2})\b/);
  if (direct) {
    const n = Number(direct[1]);
    const g = SDGS.find(x => x.n === n);
    if (g) return g;
  }

  for (const [alias, n] of Object.entries(SDG_ALIASES)) {
    if (ql.includes(alias)) return SDGS.find(x => x.n === n) || null;
  }

  return SDGS.find(g => ql.includes(g.t.toLowerCase())) || null;
}

function topicReply(topic, detailed = false) {
  switch (topic) {
    case 'wll':
      return detailed
        ? `World's Largest Lesson is a global education movement that teaches the 17 SDGs to young people.\nIn Sri Lanka, WLL 2026 is organized by AIESEC and focused on school impact through youth-led sessions.\n${EVENT.scope} 🌍`
        : `WLL 2026 is AIESEC Sri Lanka's SDG education initiative for schools. ${EVENT.scope} 🌍`;
    case 'run':
      return detailed
        ? `${EVENT.run.name} is a purpose-driven fundraising run under WLL 2026.\nDate & time: ${EVENT.run.date}, ${EVENT.run.time}.\nLocation: ${EVENT.run.place}. Distance: ${EVENT.run.distance}.\nRegistration: ${EVENT.run.fee}, and participants receive ${EVENT.run.perks}. 🏃`
        : `${EVENT.run.name} is on ${EVENT.run.date} at ${EVENT.run.time}, ${EVENT.run.place} (${EVENT.run.distance}). Fee: ${EVENT.run.fee}. 🏃`;
    case 'volunteer':
      return detailed
        ? `Volunteer registration is open and ${EVENT.volunteer.fee}.\nVolunteer day is ${EVENT.volunteer.date}.\nEligibility: ${EVENT.volunteer.age}.\nEach volunteer supports one lesson in one assigned school. 🙌`
        : `Volunteering is ${EVENT.volunteer.fee}, for ages ${EVENT.volunteer.age}, with sessions on ${EVENT.volunteer.date}. 🙌`;
    case 'competition':
      return detailed
        ? `WLL Art Competition is open for ages ${EVENT.competition.age}.\nEntry is ${EVENT.competition.fee}.\nSubmit your SDG-themed artwork by ${EVENT.competition.deadline}.\nJudging is based on creativity, SDG connection, and visual impact. 🎨`
        : `The art competition is free for ages ${EVENT.competition.age}, and the deadline is ${EVENT.competition.deadline}. 🎨`;
    case 'contact':
      return detailed
        ? `You can reach the team via:\n• Call/WhatsApp: ${EVENT.contact.phone}\n• Instagram: ${EVENT.contact.instagram}\n• Email: ${EVENT.contact.email} 📞`
        : `Contact: ${EVENT.contact.phone} or ${EVENT.contact.instagram}. 📞`;
    case 'scope':
      return `${EVENT.scope} 📍`;
    default:
      return null;
  }
}

function localReply(q, lastTopic) {
  const ql = q.toLowerCase().trim();
  const wantsDetail = hasAny(ql, DETAIL_HINTS) || ql.length > 85;
  const asksMoreOnly = hasAny(ql, ['more', 'details', 'explain', 'elaborate']) && ql.split(' ').length <= 6;

  if (asksMoreOnly && lastTopic) {
    const more = topicReply(lastTopic, true);
    if (more) return { text: more, topic: lastTopic };
  }

  if (hasAny(ql, KB.greet)) return { text: "Hi! I'm WLL Helper. Ask me about SDGs, Miles for Lessons, volunteering, or the art competition. 😊", topic: 'wll' };
  if (hasAny(ql, KB.thanks)) return { text: 'Always happy to help. If you want, ask me for more details on any SDG or event item. 🤝', topic: lastTopic || 'wll' };
  if (hasAny(ql, KB.smallTalk)) return { text: "I'm doing great, thanks. I'm here to give quick, clear answers about SDGs and WLL 2026. 🙂", topic: 'wll' };

  const sdg = findSDG(ql);
  if (sdg) {
    const text = wantsDetail
      ? `SDG ${sdg.n} - ${sdg.t}:\n${sdg.d}\nKey points: ${sdg.facts.join(' · ')} 🌱`
      : `SDG ${sdg.n} is ${sdg.t}. ${sdg.facts[0]}. Ask "more about SDG ${sdg.n}" if you want a deeper explanation. 🌱`;
    return { text, topic: `sdg-${sdg.n}` };
  }

  if (hasAny(ql, KB.run)) return { text: topicReply('run', wantsDetail), topic: 'run' };
  if (hasAny(ql, KB.volunteer)) return { text: topicReply('volunteer', wantsDetail), topic: 'volunteer' };
  if (hasAny(ql, KB.comp)) return { text: topicReply('competition', wantsDetail), topic: 'competition' };
  if (hasAny(ql, KB.contact)) return { text: topicReply('contact', wantsDetail), topic: 'contact' };
  if (hasAny(ql, KB.scope)) return { text: topicReply('scope', wantsDetail), topic: 'scope' };
  if (hasAny(ql, KB.wll)) return { text: topicReply('wll', wantsDetail), topic: 'wll' };
  if (hasAny(ql, KB.sdg)) {
    return {
      text: 'There are 17 SDGs. Ask me like: "SDG 4", "climate action", or "which SDG fits ocean pollution?" 🌱',
      topic: 'sdg',
    };
  }

  // Unknown — let AI handle it
  return null;
}

const SYSTEM = `You are WLL Helper, the official chatbot for Islandwide World's Largest Lesson (WLL) 2026 in Sri Lanka.

TRUSTED FACTS (use these when relevant):
- WLL 2026 is organized by AIESEC in Sri Lanka.
- Current scope: 10+ districts, 40+ schools, 30,000+ students islandwide.
- Miles for Lessons run: Saturday, 11 July 2026, 4:30 PM, Race Course Grounds (Colombo 07), about 5 km.
- Volunteer day: 3 August 2026, ages 18-30, registration is free.
- Art competition: ages 11-15, free entry, deadline 31 August 2026.
- Contact: 070 150 6924, Instagram @wll.srilanka, email wll26coreteam@aiesec.net.
- SDGs: answer accurately for all 17 UN Sustainable Development Goals.

RESPONSE STYLE:
- Be warm and friendly.
- Default to short, direct answers (1-3 short sentences).
- If user asks for more details, provide a longer structured answer.
- Use simple language suitable for teens and young adults.

SAFETY AND ACCURACY RULES:
- Stay on WLL 2026, SDGs, competition, volunteering, run, and contact topics.
- If user asks unrelated topics, politely redirect to SDG/WLL topics.
- If information is uncertain, say so clearly and suggest official contact.
- Do not invent links, numbers, people, or dates.`;

/* ── AI fetch — calls Groq API directly from the browser ───── */
async function fetchAI(messages) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('No API key');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [{ role: 'system', content: SYSTEM }, ...messages],
      max_tokens: 420,
      temperature: 0.35,
    }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.choices[0].message.content;
}

/* ── Quick suggestion chips ────────────────────────────────── */
const SUGGESTIONS = [
  'What is WLL 2026?',
  'Tell me about the art competition',
  'What is SDG 4?',
  'Which districts are covered?',
  'How do I volunteer?',
  'What are the SDGs?',
];

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([{ role:'bot', text:"Hi! I'm the WLL 2026 chatbot 🌍 I can help you learn about the World's Largest Lesson, the 17 SDGs, our art competition, and how to get involved. What would you like to know?" }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots]       = useState(0);
  const [lastTopic, setLastTopic] = useState('wll');
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, loading]);
  useEffect(() => { if (open) setTimeout(()=>inputRef.current?.focus(), 300); }, [open]);
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(()=>setDots(d=>(d+1)%4), 400);
    return ()=>clearInterval(t);
  }, [loading]);

  const send = useCallback(async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput('');
    setMsgs(m => [...m, { role:'user', text:q }]);
    setLoading(true);

    // Try local knowledge base first
    const local = localReply(q, lastTopic);
    if (local) {
      await new Promise(r=>setTimeout(r, 600));
      setMsgs(m => [...m, { role:'bot', text:local.text }]);
      if (local.topic) setLastTopic(local.topic);
      setLoading(false);
      return;
    }

    // Fall back to AI
    try {
      const history = msgs.slice(-8).map(m=>({ role:m.role==='bot'?'assistant':'user', content:m.text }));
      history.push({ role:'user', content:q });
      const reply = await fetchAI(history);
      setMsgs(m => [...m, { role:'bot', text:reply }]);
      if (hasAny(q.toLowerCase(), KB.sdg)) setLastTopic('sdg');
    } catch {
      setMsgs(m => [...m, { role:'bot', text:"Sorry, I couldn't connect to the AI right now. But I can still answer questions about WLL 2026 and the SDGs! Try asking me about a specific SDG 😊", error:true }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, msgs]);

  const onKey = e => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* FAB */}
      <button className={`${s.fab} ${open?s.fabOpen:''}`} onClick={()=>setOpen(v=>!v)} aria-label="Open chatbot">
        {open ? '✕' : '💬'}
        {!open && <span className={s.fabBadge}>Ask me!</span>}
      </button>

      {/* Window */}
      <div className={`${s.window} ${open?s.windowOpen:''}`} role="dialog" aria-label="WLL Chatbot">
        <div className={s.header}>
          <div className={s.headerAvatar}>🌍</div>
          <div>
            <div className={s.headerName}>WLL Helper</div>
            <div className={s.headerSub}><span className={s.onlineDot}/>Online · Ask me anything!</div>
          </div>
          <button className={s.close} onClick={()=>setOpen(false)}>✕</button>
        </div>

        <div className={s.messages}>
          {msgs.map((m, i) => (
            <div key={i} className={`${s.msg} ${m.role==='user'?s.user:s.bot}`}>
              {m.role==='bot' && <div className={s.avatar}>🌍</div>}
              <div className={`${s.bubble} ${m.error?s.errBubble:''}`}>
                {m.text.split('\n').map((line,j) => <p key={j}>{line}</p>)}
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${s.msg} ${s.bot}`}>
              <div className={s.avatar}>🌍</div>
              <div className={s.bubble}><span className={s.typing}>{'● '.repeat(dots+1).trim()}</span></div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Suggestions */}
        {msgs.length <= 2 && (
          <div className={s.chips}>
            {SUGGESTIONS.map(q=>(
              <button key={q} className={s.chip} onClick={()=>send(q)}>{q}</button>
            ))}
          </div>
        )}

        <div className={s.inputRow}>
          <input
            ref={inputRef}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask about SDGs, WLL 2026, competition…"
            disabled={loading}
            className={s.input}
          />
          <button className={s.sendBtn} onClick={()=>send()} disabled={!input.trim()||loading}>➤</button>
        </div>
      </div>
    </>
  );
}

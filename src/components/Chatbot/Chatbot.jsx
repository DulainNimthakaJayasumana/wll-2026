import { useState, useRef, useEffect, useCallback } from 'react';
import { SDGS } from '../../data/sdgs';
import s from './Chatbot.module.css';

/* ── Knowledge base for fallback responses ─────────────────── */
const KB = {
  greet: ['hi','hello','hey','ayubowan','vanakkam','hola'],
  wll:   ['wll','world','largest','lesson','what is'],
  sdg:   ['sdg','goal','sustainable','development'],
  comp:  ['competition','art','draw','submit','entry','entries'],
  date:  ['date','when','time','schedule'],
  who:   ['aiesec','who','organis','organiz'],
  dist:  ['district','where','school','location'],
  age:   ['age','grade','year','student','child'],
  contact:['contact','phone','instagram','reach','call','whatsapp'],
  volunteer:['volunteer','join','participate','help'],
};

function localReply(q) {
  const ql = q.toLowerCase();
  const has = keys => keys.some(k => ql.includes(k));

  if (has(KB.greet)) return "Hi there! 👋 Welcome to World's Largest Lesson 2026! I'm the WLL chatbot. You can ask me about the SDGs, the event, the art competition, or anything about AIESEC WLL 2026! 🌍";
  if (has(KB.comp))  return "🎨 The WLL 2026 Art Competition is open to all students aged 11–15! Draw any one of the 17 SDGs using pencil, paint or digital art. Submit your entry to our Google Drive folder by 31 August 2026. Winners are announced at WLL 2026! Ask me about specific SDGs for inspiration 🌟";
  if (has(KB.dist))  return "📍 WLL 2026 will reach 15 districts across Sri Lanka — from Jaffna in the north to Matara in the south! We're targeting 55–60 schools with 500–600 volunteers.";
  if (has(KB.age))   return "🎓 WLL 2026 is designed for students aged 11–15 years (school-level). The art competition is open to this age group. University students can also volunteer!";
  if (has(KB.volunteer)) return "🙌 Awesome! To volunteer for WLL 2026, reach out to AIESEC in Sri Lanka via Instagram @wll.srilanka or call 070 150 6924. University students especially welcome!";
  if (has(KB.contact))   return "📞 You can reach the WLL team at:\n• Call/WhatsApp: 070 150 6924\n• Instagram: @wll.srilanka\n• Coordinator: Dulain Jayasumana";
  if (has(KB.who))   return "🏢 WLL 2026 in Sri Lanka is organised by AIESEC — the world's largest youth-run organisation. AIESEC has been a key global partner of the World's Largest Lesson for years!";
  if (has(KB.date))  return "📅 WLL 2026 is planned for September 2026! The art competition deadline is 31 August 2026. Follow @wll.srilanka on Instagram for exact lesson dates.";
  if (has(KB.wll))   return "🌍 The World's Largest Lesson is a global education initiative that teaches the 17 UN Sustainable Development Goals to children everywhere. In Sri Lanka, AIESEC runs it islandwide — reaching 15 districts, 55–60 schools and 500–600 student volunteers in 2026!";

  // SDG lookup by number
  const numMatch = ql.match(/\b(\d{1,2})\b/);
  if (numMatch && has(KB.sdg)) {
    const n = parseInt(numMatch[1]);
    const g = SDGS.find(g => g.n === n);
    if (g) return `🎯 SDG ${g.n}: ${g.t}\n\n${g.d}\n\nKey facts: ${g.facts.join(' · ')}`;
  }

  // SDG by name
  const matchedSDG = SDGS.find(g => ql.includes(g.t.toLowerCase()) || g.t.toLowerCase().split(' ').some(w=>w.length>4&&ql.includes(w)));
  if (matchedSDG) return `🎯 SDG ${matchedSDG.n}: ${matchedSDG.t}\n\n${matchedSDG.d}\n\nFacts: ${matchedSDG.facts.join(' · ')}`;

  if (has(KB.sdg))   return `🌱 There are 17 Sustainable Development Goals (SDGs)! You can scroll through them all on this website. Ask me about a specific one by number (e.g. "Tell me about SDG 4") or by name like "climate action" or "zero hunger" 😊`;

  return null; // Fall through to AI
}

/* ── AI fetch (your backend on /api/chat) ──────────────────── */
async function fetchAI(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.reply;
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
    const local = localReply(q);
    if (local) {
      await new Promise(r=>setTimeout(r, 600));
      setMsgs(m => [...m, { role:'bot', text:local }]);
      setLoading(false);
      return;
    }

    // Fall back to AI
    try {
      const history = msgs.slice(-8).map(m=>({ role:m.role==='bot'?'assistant':'user', content:m.text }));
      history.push({ role:'user', content:q });
      const reply = await fetchAI(history);
      setMsgs(m => [...m, { role:'bot', text:reply }]);
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

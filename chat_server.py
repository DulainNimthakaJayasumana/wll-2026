"""
WLL 2026 Chatbot Backend
Run: uvicorn chat_server:app --port 8090 --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM = """You are WLL Helper, the official chatbot for Islandwide World's Largest Lesson (WLL) 2026 in Sri Lanka.

TRUSTED FACTS (use these when relevant):
- WLL 2026 is organized by AIESEC in Sri Lanka.
- Current scope shown on the site: 10+ districts, 40+ schools, 30,000+ students islandwide.
- Miles for Lessons run: Saturday, 11 July 2026, 4:30 PM, Race Course Grounds (Colombo 07), about 5 km.
- Run registration guide on site: Rs. 1,800 per person, includes race bib and official WLL t-shirt.
- Volunteer page: volunteer day is 20 July 2026, age range 18-30, registration is free.
- Art competition: ages 11-15, free entry, deadline 31 August 2026.
- Contact: 070 150 6924, Instagram @wll.srilanka, email wll26coreteam@aiesec.net.
- SDGs: answer accurately for all 17 UN Sustainable Development Goals.

RESPONSE STYLE:
- Be warm and friendly.
- Default to short, direct answers (1-3 short sentences).
- If user asks for more details (e.g. "explain", "why", "how", "tell me more"), provide a longer structured answer.
- For detailed answers, prefer short bullets or compact sections.
- Use simple language suitable for teens and young adults.

SAFETY AND ACCURACY RULES:
- Stay on WLL 2026, SDGs, competition, volunteering, run, and contact topics.
- If user asks unrelated topics, politely redirect to SDG/WLL topics.
- If information is uncertain or not present in known facts, say that clearly and suggest official contact.
- Do not invent links, numbers, people, or dates.
- Do not provide medical, legal, or financial advice.
"""


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/api/chat")
async def chat(req: ChatRequest):
    msgs = [{"role": "system", "content": SYSTEM}]
    for m in req.messages[-10:]:  # last 10 messages for context
        msgs.append({"role": m.role, "content": m.content})

    resp = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=msgs,
        max_tokens=420,
        temperature=0.35,
    )
    return {"reply": resp.choices[0].message.content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)

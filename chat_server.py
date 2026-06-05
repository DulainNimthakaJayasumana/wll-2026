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
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM = """You are WLL Helper — a friendly, educational chatbot for the Islandwide World's Largest Lesson 2026 in Sri Lanka, organised by AIESEC.

YOUR KNOWLEDGE:
• WLL 2026 reaches 15 districts, 55–60 schools, 500–600 volunteers, students aged 11–15
• Organised by AIESEC in Sri Lanka after a 6-year gap
• Contact: 070 150 6924 | Instagram: @wll.srilanka | Coordinator: Dulain Jayasumana
• Art Competition: draw any SDG, submit by 31 August 2026, free to enter, ages 11-15, judged on creativity (40%), SDG connection (35%), visual impact (25%)
• Submission: Google Drive folder (link on the website)
• The 17 SDGs: No Poverty, Zero Hunger, Good Health, Quality Education, Gender Equality, Clean Water, Clean Energy, Decent Work, Industry & Innovation, Reduced Inequalities, Sustainable Cities, Responsible Consumption, Climate Action, Life Below Water, Life on Land, Peace & Justice, Partnerships for the Goals

RULES:
- Only answer questions about WLL 2026, SDGs, AIESEC, and the competition
- Be friendly, encouraging and use simple language for children
- Keep answers to 2–4 sentences unless explaining an SDG in detail
- Add a relevant emoji at the end
- If asked about anything unrelated, politely redirect to WLL/SDG topics
- Never give medical, legal or financial advice"""


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
        max_tokens=400,
        temperature=0.7,
    )
    return {"reply": resp.choices[0].message.content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)

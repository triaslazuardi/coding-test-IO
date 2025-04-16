from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import random

app = FastAPI()

# Load dummy data
# with open("dummyData.json", "r") as f:
with open("../dummyData.json", "r") as f:
    DUMMY_DATA = json.load(f)

# @app.get("/api/data")
@app.get("/api/sales-reps")
def get_data():
    """
    Returns dummy data (e.g., list of users).
    """
    return DUMMY_DATA


DUMMY_RESPONSES = [
    "Hmm, menarik! Tapi saya hanya AI palsu 😅",
    "Maaf, saya belum cukup pintar untuk menjawab itu 😁",
    "Pertanyaan bagus! Tapi saya hanya placeholder bot.",
    "Aku belum nyambung ke AI sungguhan, tapi terima kasih sudah bertanya!",
]

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns a placeholder AI response.
    (Optionally integrate a real AI model or external service here.)
    """
    body = await request.json()
    user_question = body.get("question", "")
    response = random.choice(DUMMY_RESPONSES)
    # Placeholder logic: echo the question or generate a simple response
    # Replace with real AI logic as desired (e.g., call to an LLM).
    return {"answer": f"{response} >> This is a placeholder answer to your question: {user_question}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

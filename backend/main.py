from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ingestor import ingest_document
from retriever import retrieve_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    result = await ingest_document(file)
    return {"message": result}

@app.post("/chat")
async def chat(payload: dict):
    question = payload.get("question")
    answer = retrieve_answer(question)
    return {"answer": answer}

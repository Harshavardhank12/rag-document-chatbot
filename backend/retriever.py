import os
import numpy as np
from sentence_transformers import SentenceTransformer
from groq import Groq
import ingestor

model = SentenceTransformer("all-MiniLM-L6-v2")
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def retrieve_answer(question: str):
    if not ingestor.chunks:
        return "Please upload a document first.", []

    q_embedding = model.encode([question])
    distances, indices = ingestor.index.search(
        np.array(q_embedding).astype("float32"), k=3
    )

    top = [i for i in indices[0] if i < len(ingestor.chunks)]
    context = "\n\n".join([ingestor.chunks[i] for i in top])
    source_pages = sorted({ingestor.pages[i] for i in top})
    
    client_groq = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    response = client_groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Answer questions based only on the provided context."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
        ]
    )
    
    return response.choices[0].message.content, source_pages

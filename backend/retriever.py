import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from groq import Groq
from ingestor import chunks, index

model = SentenceTransformer("all-MiniLM-L6-v2")
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def retrieve_answer(question: str) -> str:
    if not chunks:
        return "Please upload a document first."
    
    # Embed question and search FAISS
    q_embedding = model.encode([question])
    distances, indices = index.search(
        np.array(q_embedding).astype("float32"), k=3
    )

    # Get top 3 relevant chunks
    context = "\n\n".join([chunks[i] for i in indices[0] if i < len(chunks)])

    # Send to Groq LLaMA
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Answer questions based only on the provided context."
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {question}"
            }
        ]
    )

    return response.choices[0].message.content

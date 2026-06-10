import pdfplumber
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.IndexFlatL2(384)
chunks = []
pages = []

async def ingest_document(file):
    global chunks, pages, index
    chunks = []
    pages = []

    content = await file.read()
    with open("temp.pdf", "wb") as f:
        f.write(content)

    with pdfplumber.open("temp.pdf") as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                words = text.split()
                for i in range(0, len(words), 200):
                    chunk = " ".join(words[i:i+200])
                    chunks.append(chunk)
                    pages.append(page.page_number)
    
    print(f"CHUNKS CREATED: {len(chunks)}")  # ADD THIS LINE
    
    embeddings = model.encode(chunks)
    index = faiss.IndexFlatL2(384)
    index.add(np.array(embeddings).astype("float32"))
    
    print(f"INDEX BUILT: {index.ntotal} vectors")  # ADD THIS LINE
    
    return f"Ingested {len(chunks)} chunks successfully"


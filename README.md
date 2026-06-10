# RAG Document Chatbot

An AI-powered document Q&A application that allows users to upload PDF documents and ask questions using Retrieval Augmented Generation (RAG).

## Tech Stack
- **Backend:** Python, FastAPI, FAISS, Sentence Transformers
- **AI:** Groq LLaMA 3 (llama3-8b-8192)
- **Frontend:** React
- **Deployment:** Docker

## How It Works
1. User uploads a PDF document
2. Document is split into chunks and embedded using Sentence Transformers
3. Embeddings stored in FAISS vector store
4. User asks a question — top 3 relevant chunks retrieved
5. Groq LLaMA 3 generates an answer based on retrieved context

## Setup
```bash
# Clone the repo
git clone https://github.com/Harshavardhank12/rag-document-chatbot

# Set your Groq API key
export GROQ_API_KEY=your_key_here

# Run with Docker
docker-compose up --build
```

## Results
- Processes PDFs of any size
- Sub-second retrieval using FAISS
- Accurate context-aware answers using LLaMA 3

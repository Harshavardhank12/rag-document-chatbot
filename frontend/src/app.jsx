import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [uploaded, setUploaded] = useState(false);
  const [messages, setMessages] = useState([]);

  const sendMessage = async (question) => {
    setMessages(prev => [...prev, { role: "user", text: question }]);
    
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <h1>📄 RAG Document Chatbot</h1>
      <FileUpload onUpload={() => setUploaded(true)} />
      {uploaded && <ChatWindow messages={messages} onSend={sendMessage} />}
    </div>
  );
}

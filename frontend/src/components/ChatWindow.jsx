import { useState } from "react";
import Message from "./Message";

export default function ChatWindow({ messages, onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, minHeight: 300, marginBottom: 12 }}>
        {messages.length === 0 && <p style={{ color: "#999" }}>Ask a question about your document...</p>}
        {messages.map((msg, i) => <Message key={i} message={msg} />)}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
          style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button onClick={handleSend} style={{ padding: "8px 20px", borderRadius: 6, background: "#0070f3", color: "white", border: "none", cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
}

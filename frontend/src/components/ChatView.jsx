import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { DocIcon, SendIcon } from "./Icons";

export default function ChatView({ doc, messages, isTyping, onSend }) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const submit = (e) => {
    e.preventDefault();
    const question = draft.trim();
    if (!question || isTyping) return;
    setDraft("");
    onSend(question);
  };

  return (
    <section className="chat">
      <header className="chat-header">
        <span className="chat-doc-icon">
          <DocIcon size={16} />
        </span>
        <span className="chat-doc-name">{doc?.name ?? "Document"}</span>
      </header>

      <div className="messages" ref={scrollRef}>
        {messages.length === 0 && !isTyping ? (
          <div className="messages-empty">
            Ask me anything about your document
          </div>
        ) : (
          <div className="messages-inner">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>

      <div className="chat-input-wrap">
        <form className="chat-input" onSubmit={submit}>
          <input
            type="text"
            placeholder="Ask a follow-up…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!draft.trim() || isTyping}
            aria-label="Send message"
          >
            <SendIcon size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}

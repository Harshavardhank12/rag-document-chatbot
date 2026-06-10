import { useState } from "react";
import FileUpload from "./FileUpload";
import { useGreeting } from "../hooks/useGreeting";
import { useTypewriter } from "../hooks/useTypewriter";
import { LockIcon, SparkleIcon } from "./Icons";

export default function HomeView({ apiBase, doc, onUploaded, onError, onAsk }) {
  const greetingLines = useGreeting();
  const typedGreeting = useTypewriter(greetingLines);
  const [question, setQuestion] = useState("");
  const ready = Boolean(doc);

  const submit = () => {
    if (!ready) return;
    onAsk(question.trim());
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const autoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <main className="home">
      <h1 className="home-greeting" aria-label={greetingLines[0]}>
        <span>{typedGreeting}</span>
        <span className="caret" aria-hidden="true" />
      </h1>
      <p className="home-subtitle">
        Upload a document and ask anything about it.
      </p>

      <div className="input-card">
        <FileUpload apiBase={apiBase} onUploaded={onUploaded} onError={onError} />

        <textarea
          className="card-textarea"
          placeholder="What would you like to know?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onInput={autoGrow}
          onKeyDown={handleKeyDown}
          rows={2}
        />

        <div className="card-foot">
          <span className="card-hint">
            <LockIcon size={11} />
            Your document stays private
          </span>
          <button className="ask-btn" disabled={!ready} onClick={submit}>
            <SparkleIcon size={13} />
            Ask Pagewise
          </button>
        </div>
      </div>
    </main>
  );
}

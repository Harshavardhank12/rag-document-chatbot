import { BookIcon } from "./Icons";

export default function TypingIndicator() {
  return (
    <div className="msg msg-ai">
      <div className="avatar">
        <BookIcon size={15} />
      </div>
      <div className="typing" aria-label="Pagewise is thinking">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

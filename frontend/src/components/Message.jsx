import { BookIcon, UserIcon } from "./Icons";

export default function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`msg ${isUser ? "msg-user" : "msg-ai"}`}>
      <div className="avatar">
        {isUser ? <UserIcon size={14} /> : <BookIcon size={15} />}
      </div>
      <div className="msg-body">
        <div className={`bubble ${message.error ? "error" : ""}`}>
          {message.text}
        </div>
      </div>
    </div>
  );
}

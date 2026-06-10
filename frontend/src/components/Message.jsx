export default function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 10
    }}>
      <div style={{
        background: isUser ? "#0070f3" : "#f0f0f0",
        color: isUser ? "white" : "black",
        padding: "8px 14px",
        borderRadius: 16,
        maxWidth: "70%"
      }}>
        {message.text}
      </div>
    </div>
  );
}

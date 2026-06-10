import { useState, useCallback } from "react";

let nextId = 0;
const newId = () => `msg-${++nextId}`;

export function useChat(apiBase) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    async (question) => {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "user", text: question },
      ]);
      setIsTyping(true);

      try {
        const res = await fetch(`${apiBase}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            text: data.answer,
            sources: Array.isArray(data.sources) ? data.sources : [],
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            text: "I couldn't reach the server. Make sure the backend is running, then try again.",
            error: true,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [apiBase]
  );

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  return { messages, isTyping, sendMessage, resetChat };
}

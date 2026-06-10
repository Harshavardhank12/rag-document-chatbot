import { useCallback, useEffect, useRef, useState } from "react";
import Ambient from "./components/Ambient";
import Sidebar from "./components/Sidebar";
import HomeView from "./components/HomeView";
import ChatView from "./components/ChatView";
import { useChat } from "./hooks/useChat";
import { BookIcon, CheckIcon, MenuIcon } from "./components/Icons";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const RECENTS_KEY = "pagewise-recents";

function loadRecents() {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENTS_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [view, setView] = useState("home");
  const [doc, setDoc] = useState(null);
  const [recents, setRecents] = useState(loadRecents);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const { messages, isTyping, sendMessage, resetChat } = useChat(API_BASE_URL);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((text) => {
    clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const handleUploaded = useCallback(
    (name) => {
      const entry = { name, time: Date.now() };
      setDoc(entry);
      setRecents((prev) => {
        const next = [entry, ...prev.filter((r) => r.name !== name)].slice(
          0,
          15
        );
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
        return next;
      });
      showToast("Document ready — ask away");
    },
    [showToast]
  );

  const handleUploadError = useCallback(() => {
    showToast("Upload failed — check the backend and try again");
  }, [showToast]);

  const handleAsk = useCallback(
    (question) => {
      setView("chat");
      if (question) sendMessage(question);
    },
    [sendMessage]
  );

  const handleDeleteRecent = useCallback((recent) => {
    setRecents((prev) => {
      const next = prev.filter(
        (r) => !(r.name === recent.name && r.time === recent.time)
      );
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleNewDocument = useCallback(() => {
    setDoc(null);
    resetChat();
    setView("home");
    setSidebarOpen(false);
  }, [resetChat]);

  const handleRecentClick = useCallback(
    (recent) => {
      if (doc && recent.name === doc.name) {
        setView("chat");
        setSidebarOpen(false);
      } else {
        showToast("Upload this document again to chat with it");
      }
    },
    [doc, showToast]
  );

  return (
    <div className="app">
      <Ambient />
      <Sidebar
        open={sidebarOpen}
        recents={recents}
        activeDoc={doc}
        onRecentClick={handleRecentClick}
        onDeleteRecent={handleDeleteRecent}
        onNewDocument={handleNewDocument}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main">
        <header className="topbar">
          <button
            className="topbar-burger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon size={19} />
          </button>
          <span className="topbar-title">
            <span className="sidebar-logo-mark">
              <BookIcon size={14} />
            </span>
            Pagewise
          </span>
        </header>

        {view === "home" ? (
          <HomeView
            apiBase={API_BASE_URL}
            doc={doc}
            onUploaded={handleUploaded}
            onError={handleUploadError}
            onAsk={handleAsk}
          />
        ) : (
          <ChatView
            doc={doc}
            messages={messages}
            isTyping={isTyping}
            onSend={sendMessage}
          />
        )}
      </div>

      {toast && (
        <div className="toast" role="status">
          <span className="toast-check">
            <CheckIcon size={13} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

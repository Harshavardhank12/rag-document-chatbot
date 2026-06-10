import { useEffect, useState } from "react";
import { BookIcon, DocIcon, DotsIcon, PlusIcon } from "./Icons";

function timeAgo(timestamp) {
  const mins = Math.floor((Date.now() - timestamp) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

export default function Sidebar({
  open,
  recents,
  activeDoc,
  onRecentClick,
  onDeleteRecent,
  onNewDocument,
  onClose,
}) {
  const [menuFor, setMenuFor] = useState(null);

  useEffect(() => {
    if (!menuFor) return undefined;
    const close = () => setMenuFor(null);
    const onKey = (e) => {
      if (e.key === "Escape") setMenuFor(null);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuFor]);

  return (
    <>
      <div
        className={`drawer-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">
            <BookIcon size={17} />
          </span>
          <span className="sidebar-logo-name">Pagewise</span>
        </div>

        <div className="sidebar-section-label">Recents</div>
        <nav className="sidebar-recents">
          {recents.length === 0 ? (
            <p className="sidebar-empty">
              Documents you upload will show up here.
            </p>
          ) : (
            recents.map((recent) => {
              const id = `${recent.name}-${recent.time}`;
              return (
                <div
                  key={id}
                  className={`recent-item ${
                    activeDoc && recent.name === activeDoc.name ? "active" : ""
                  } ${menuFor === id ? "menu-open" : ""}`}
                >
                  <button
                    className="recent-main"
                    onClick={() => onRecentClick(recent)}
                  >
                    <span className="recent-icon">
                      <DocIcon size={16} />
                    </span>
                    <span className="recent-meta">
                      <span className="recent-name">{recent.name}</span>
                      <div className="recent-time">{timeAgo(recent.time)}</div>
                    </span>
                  </button>
                  <button
                    className="recent-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuFor(menuFor === id ? null : id);
                    }}
                    aria-label={`Options for ${recent.name}`}
                    aria-haspopup="menu"
                    aria-expanded={menuFor === id}
                    title="Options"
                  >
                    <DotsIcon size={15} />
                  </button>
                  {menuFor === id && (
                    <div className="recent-menu" role="menu">
                      <button
                        className="recent-menu-item"
                        role="menuitem"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuFor(null);
                          onDeleteRecent(recent);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        <button className="new-doc-btn" onClick={onNewDocument}>
          <PlusIcon size={14} />
          New document
        </button>
      </aside>
    </>
  );
}

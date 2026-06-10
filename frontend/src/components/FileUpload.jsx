import { useRef, useState } from "react";
import { PaperclipIcon, CheckIcon } from "./Icons";

export default function FileUpload({ apiBase, onUploaded, onError }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | ready | error
  const [fileName, setFileName] = useState(null);

  const handlePick = async (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      setStatus("ready");
      onUploaded(file.name);
    } catch {
      setStatus("error");
      onError?.();
    } finally {
      input.value = "";
    }
  };

  return (
    <div className="attach-row">
      <button
        type="button"
        className="attach-btn"
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
      >
        <PaperclipIcon size={14} />
        {fileName ? "Replace PDF" : "Attach a PDF"}
      </button>

      {fileName && (
        <span
          key={`${fileName}-${status}`}
          className={`file-chip ${status === "error" ? "error" : ""}`}
        >
          {status === "uploading" && <span className="spinner" />}
          {status === "ready" && <CheckIcon size={12} />}
          <span className="file-chip-name">
            {status === "error" ? "Upload failed — try again" : fileName}
          </span>
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={handlePick}
      />
    </div>
  );
}

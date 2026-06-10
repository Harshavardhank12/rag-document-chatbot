import { useEffect, useState } from "react";

const TYPE_MS = 72;
const DELETE_MS = 34;
const HOLD_MS = 2300;
const GAP_MS = 480;

export function useTypewriter(phrases) {
  const [index, setIndex] = useState(0);
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced) return undefined;

    const phrase = phrases[index % phrases.length];
    let delay;
    if (!deleting) {
      delay =
        len < phrase.length ? TYPE_MS + Math.random() * 60 : HOLD_MS;
    } else {
      delay = len > 0 ? DELETE_MS : GAP_MS;
    }

    const timer = setTimeout(() => {
      if (!deleting) {
        if (len < phrase.length) setLen(len + 1);
        else setDeleting(true);
      } else if (len > 0) {
        setLen(len - 1);
      } else {
        setDeleting(false);
        setIndex((index + 1) % phrases.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [phrases, index, len, deleting, reduced]);

  if (reduced) return phrases[0];
  return phrases[index % phrases.length].slice(0, len);
}

import { useState } from "react";

const BUCKETS = [
  { from: 0, to: 5, lines: ["Hey, still up?", "Hi, burning the midnight oil?"] },
  { from: 5, to: 9, lines: ["Hey, up early?", "Good morning!"] },
  { from: 9, to: 12, lines: ["Hey, coffee time?", "Hi there, good morning!"] },
  { from: 12, to: 17, lines: ["Good afternoon!", "Hey, back at it?"] },
  { from: 17, to: 20, lines: ["Good evening!", "Hey, winding down?"] },
  { from: 20, to: 24, lines: ["Hey, night owl?", "Hi, late session?"] },
];

export function useGreeting() {
  const [lines] = useState(() => {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hourCycle: "h23",
        timeZone: "America/New_York",
      }).format(new Date())
    );
    const bucket =
      BUCKETS.find((b) => hour >= b.from && hour < b.to) ?? BUCKETS[0];
    return [...bucket.lines, "What are we reading today?"];
  });

  return lines;
}

"use client";

import { useEffect, useState } from "react";

export function LiveCounter({ start = 128 }: { start?: number }) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setCount((c) => c + (Math.random() < 0.7 ? 1 : 2));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono font-bold tabular-nums text-bone">
      {count.toLocaleString("en-IN")}
    </span>
  );
}

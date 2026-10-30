import { useEffect, useState } from "react";

const QUERY = "(min-width: 720px)";

/** True on screens wide enough to lay a company out 25 squares across. */
export function useWide(): boolean {
  const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
  const [wide, setWide] = useState(() => supported && window.matchMedia(QUERY).matches);
  useEffect(() => {
    if (!supported) return;
    const mq = window.matchMedia(QUERY);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [supported]);
  return wide;
}

import { useEffect, useRef, useState } from "react";

export const PART_TWO_HASH = "#part-two";
export type Part = "one" | "two";

const read = (): Part => (window.location.hash === PART_TWO_HASH ? "two" : "one");

/** Which page to show. Part two lives at #part-two so one bundle serves both, here and inside the artifact. */
export function usePart(): Part {
  const [part, setPart] = useState<Part>(read);
  useEffect(() => {
    const onHash = () => setPart(read());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  // Each part starts at the top when you switch to it, but a first load keeps the browser's own scroll.
  const shown = useRef(part);
  useEffect(() => {
    if (shown.current === part) return;
    shown.current = part;
    window.scrollTo(0, 0);
  }, [part]);
  return part;
}

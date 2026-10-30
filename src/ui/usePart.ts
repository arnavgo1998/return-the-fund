import { useEffect, useState } from "react";

export const PART_TWO_HASH = "#part-two";
export type Part = "one" | "two";

const read = (): Part => (window.location.hash === PART_TWO_HASH ? "two" : "one");

/** Which page to show. Part two lives at #part-two so one bundle serves both, here and inside the artifact. */
export function usePart(): Part {
  const [part, setPart] = useState<Part>(read);
  useEffect(() => {
    const onHash = () => {
      const next = read();
      setPart((prev) => {
        if (prev !== next) window.scrollTo(0, 0);
        return next;
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return part;
}

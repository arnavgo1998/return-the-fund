import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./styles/global.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* The artifact copy runs in a sandbox that blocks Vercel's script. */}
    {import.meta.env.MODE !== "artifact" && <Analytics />}
  </StrictMode>,
);

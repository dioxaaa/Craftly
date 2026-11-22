import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Guard against transient Vite HMR WebSocket errors in sandboxed/proxied cloud previews
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message =
    typeof reason === "string"
      ? reason
      : reason instanceof Error
        ? reason.message
        : "";
  const normalized = message.toLowerCase();
  if (
    normalized.includes("websocket closed without opened") ||
    normalized.includes("failed to connect to websocket") ||
    normalized.includes("websocket connection")
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

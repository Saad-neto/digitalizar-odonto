import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics";

// Inicializar sistemas de analytics (GA4 + Meta Pixel)
initAnalytics();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

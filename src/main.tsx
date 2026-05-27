import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import { router } from "./routes/router";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found.");
}

createRoot(rootElement).render(<RouterProvider router={router} />);

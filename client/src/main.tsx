import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import App from "./App.tsx";
import { Notifications } from "@mantine/notifications";
import { AuthProvider } from "./contexts/Auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MantineProvider>
        <Notifications />
        <App />
      </MantineProvider>
    </AuthProvider>
  </StrictMode>
);

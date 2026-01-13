import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CoursesProvider } from "./context/CoursesContext.jsx";
import { ProgressProvider } from "./context/ProgressContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CoursesProvider>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </CoursesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

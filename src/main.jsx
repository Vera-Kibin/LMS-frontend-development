import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CoursesProvider } from "./context/CoursesContext.jsx";
import { ProgressProvider } from "./context/ProgressContext.jsx";
import { GamificationProvider } from "./context/GamificationContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ForumProvider } from "./context/ForumContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {" "}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <CoursesProvider>
            <ProgressProvider>
              <GamificationProvider>
                <ForumProvider>
                  <App />
                </ForumProvider>
              </GamificationProvider>
            </ProgressProvider>
          </CoursesProvider>
        </BrowserRouter>{" "}
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

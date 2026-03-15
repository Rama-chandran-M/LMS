import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import reportWebVitals from "./reportWebVitals";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  </QueryClientProvider>
);

reportWebVitals();
import React from "react";
import ReactDOM from "react-dom/client";
// ↓↓↓ 1. BrowserRouter를 import 합니다.
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

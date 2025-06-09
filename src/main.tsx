import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Modal from "react-modal"; // 1. react-modal import
import App from "./App.tsx";
import "./index.css";

Modal.setAppElement("#root"); // 2. 앱의 루트 요소 설정

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

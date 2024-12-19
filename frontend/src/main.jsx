import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Menu from "./component/menu";
import { SocketProvider } from "./context/socketProvider";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/*" element={<Menu />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);

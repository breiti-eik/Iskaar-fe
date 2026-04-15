import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Falls Phaser das braucht (SockJS etc.)
(window as any).global = window;

ReactDOM.createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

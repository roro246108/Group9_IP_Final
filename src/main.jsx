import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import logo from "./assets/Images/logoN.png";
import { LanguageProvider } from "./Context/LanguageContext";

const link = document.querySelector("link[rel~='icon']");
link.href = logo;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/fonts.css'
import './styles/index.css'
import { RouteProvider } from './context/RouteContext.jsx'

// Optional: Register SW secara dinamis
if ('serviceWorker' in navigator) {
  // vite-plugin-pwa akan mengenerate sw.js
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.error("Service worker registration failed:", err);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouteProvider>
      <App />
    </RouteProvider>
  </React.StrictMode>,
)

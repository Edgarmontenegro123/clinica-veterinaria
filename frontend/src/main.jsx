// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 💡 1. Importa BrowserRouter para habilitar el router
import { BrowserRouter } from 'react-router-dom'; 

import './index.css'
import App from './App.jsx'

// 💡 2. Importa el CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🔑 3. Envuelve <App /> con <BrowserRouter> 🔑 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

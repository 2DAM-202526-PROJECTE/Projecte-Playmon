import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProveidorToast } from "@/features/compte/perfil/components/toast/ProveidorToast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProveidorToast>
      <App />
    </ProveidorToast>
  </StrictMode>,
)
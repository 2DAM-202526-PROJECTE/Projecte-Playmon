import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginSingup from './components/LoginSingup/LoginSingup.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginSingup />
  </StrictMode>,
)

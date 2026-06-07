import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" toastOptions={{ duration:3000, style:{ fontSize:14, borderRadius:8, fontFamily:'Segoe UI, sans-serif' } }} />
    </AuthProvider>
  </React.StrictMode>
)
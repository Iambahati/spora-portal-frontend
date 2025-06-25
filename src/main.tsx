import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterApp from '../router/app'
import './globals.css'

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterApp />
  </React.StrictMode>,
)

// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import './firebase' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/FED2024Asg2_P04_Team4">
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>
)

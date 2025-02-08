// src/main.jsx
import React from 'react' //import react to use JSX and create react components.
import ReactDOM from 'react-dom/client' //import reactdom to render the react application in to the dom.
import './index.css' //import global css styles.
import App from './App.jsx' //import root app components which contains the overall app structure.
import { BrowserRouter } from 'react-router-dom' //import browser router from react router for client side routing
import ShopContextProvider from './context/ShopContext.jsx' //import shopcontext provider to provide global state via context to the app.
import './firebase' //import firebase configuration to initialize firebase services.

ReactDOM.createRoot(document.getElementById('root')).render( //Create the root element for the react app usign the element with id 'root'.
  <BrowserRouter basename="/FED2024Asg2_P04_Team4/"> 
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>
)

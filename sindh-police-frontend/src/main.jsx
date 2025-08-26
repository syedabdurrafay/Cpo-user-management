import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Simple rendering without initial API check
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
import { ToastContainer } from 'react-toastify';

// In your root component
<>
  <App />
  <ToastContainer position="top-right" autoClose={3000} />
</>

// Optional: Add connection check after render
const checkConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    console.log('Backend status:', await response.json());
  } catch (error) {
    console.error('Connection check failed:', error);
  }
};
checkConnection();
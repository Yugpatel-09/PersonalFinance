import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { FinanceProvider } from './context/FinanceContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FinanceProvider>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="colored"
          toastStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
        />
      </FinanceProvider>
    </BrowserRouter>
  </React.StrictMode>
);

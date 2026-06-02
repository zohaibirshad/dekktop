import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Strict mode for better development experience
const StrictMode = React.StrictMode;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

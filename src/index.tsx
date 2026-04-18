import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Self-mounting logic for PrestaShop integration.
// This script can be added to any page, and it will create its own container.

const WIDGET_CONTAINER_ID = 'ai-chatbot-root';

let container = document.getElementById(WIDGET_CONTAINER_ID);

// If the container doesn't exist, create it and append it to the body.
if (!container) {
  container = document.createElement('div');
  container.id = WIDGET_CONTAINER_ID;
  document.body.appendChild(container);
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
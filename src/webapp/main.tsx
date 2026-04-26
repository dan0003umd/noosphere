import React from 'react';
import ReactDOM from 'react-dom/client';
import WebApp from './WebApp';
import '../index.css';
import '@xyflow/react/dist/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebApp />
  </React.StrictMode>,
);

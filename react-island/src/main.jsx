import React from 'react';
import ReactDOM from 'react-dom/client';
import LogoLoop from './LogoLoop.jsx';

// Mount React ke element #skills-logo-loop di index.html
const rootElement = document.getElementById('skills-logo-loop');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LogoLoop />
    </React.StrictMode>
  );
} else {
  console.error('Element #skills-logo-loop tidak ditemukan di DOM');
}

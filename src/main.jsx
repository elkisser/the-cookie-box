import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Global helpers to prevent accidental full-page reloads caused by form submits
// and buttons without explicit type="button".
if (typeof window !== 'undefined') {
  // Prevent any form submission from performing a full page reload when JS is active.
  // We only call preventDefault if it hasn't been prevented yet.
  window.addEventListener('submit', (e) => {
    if (!e.defaultPrevented) {
      e.preventDefault();
      // Optional: log source form for debugging in dev tools
      // console.info('Prevented form submit to avoid page reload.', e.target);
    }
  }, true);

  // Ensure buttons without an explicit type default to type="button" to avoid
  // accidental form submissions. Also observe DOM for dynamically added buttons.
  const setDefaultButtonTypes = (root = document) => {
    root.querySelectorAll('button:not([type])').forEach(btn => btn.setAttribute('type', 'button'));
  };

  // Initial pass
  setDefaultButtonTypes(document);

  // Observe DOM mutations to set type on newly added buttons
  const mo = new MutationObserver(() => setDefaultButtonTypes(document));
  mo.observe(document.body, { childList: true, subtree: true });
}

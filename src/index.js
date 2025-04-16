import "./stylesGlobal.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './index.module.css';  // Import the CSS module
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // Applying the CSS module styles to the body element
  <div className={styles.style_body}>
    <App />
  </div>
);

reportWebVitals();

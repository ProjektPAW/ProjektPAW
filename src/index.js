import "./styles/stylesGlobal.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './styles/index.module.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div className={styles.style_body}>
    <App />
  </div>
);

reportWebVitals();

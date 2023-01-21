import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css';
import './assets/css/styles.css';
import './assets/css/responsive.css';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)

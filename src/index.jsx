import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';

import { AppProvider } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider>
    <App/>
  </AppProvider>
);


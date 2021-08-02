import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/style.sass'
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from 'providers/auth';
import AuthLayout from 'pages/auth/layout'
import { WsProvider } from 'providers/ws';

ReactDOM.render(
  <React.StrictMode>
    <WsProvider>
      <AuthProvider>
        <AuthLayout>
          <App />
        </AuthLayout>
      </AuthProvider>
    </WsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

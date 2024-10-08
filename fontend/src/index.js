import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles  from '~/Components/GlobalStyles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tippy.js/dist/tippy.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = process.env.REACT_APP_GG_CLIENT_ID
root.render(
  <React.StrictMode>
  <GlobalStyles>
    <App />
    </GlobalStyles>
  </React.StrictMode>
);


root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

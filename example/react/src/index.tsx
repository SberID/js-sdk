import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes,   Route } from "react-router-dom";
import './index.css';
import '@sberid/js-sdk/dist/styles/common.css';
// import './custom.theme.css';
import { App } from './App';
import { UniversalLinkDemo } from './pages/UniversalLink';
import { UserHelperDemo } from './pages/UserHelper';
import { SdkDemo } from './pages/Sdk';
import { FastLoginDemo } from './pages/FastLogin';
import reportWebVitals from './reportWebVitals';

render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sdk" element={<SdkDemo />} />
        <Route path="/fast-login" element={<FastLoginDemo />} />
        <Route path="/universallink" element={<UniversalLinkDemo />} />
        <Route path="/user-helper" element={<UserHelperDemo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

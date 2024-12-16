import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withProviders } from './hoc/withProviders';
import App from './App';
import HowItWorks from './components/HowItWorks';
import './index.css';

const WrappedApp = withProviders(App);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<WrappedApp />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
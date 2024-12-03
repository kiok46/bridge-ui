import React from 'react';
import ReactDOM from 'react-dom/client';
import { withProviders } from './hoc/withProviders';
import App from './App';
import './index.css';

const WrappedApp = withProviders(App);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <WrappedApp />
  </React.StrictMode>
); 
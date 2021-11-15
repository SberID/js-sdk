import React from 'react';
import { Navigation } from './components';

export const App = () => {
  return (
    <div className="layout">
        <div className="header">
            <Navigation />
            <div className="typography typography--body">SDK Demo:</div>
        </div>
    </div>
  );
}
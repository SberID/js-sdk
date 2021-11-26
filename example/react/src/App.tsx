import React, { FC } from 'react';
import { Navigation } from './components';

export const App: FC = () => {
  return (
    <div className="main-page">
      <div className="typography typography--headline typography--color-white">Сбер ID SDK Demo</div>
      <Navigation />
    </div>
  );
}
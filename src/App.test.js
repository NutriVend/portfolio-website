import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { HashRouter as Router } from 'react-router-dom';

test('App renders without crashing', () => {
  render(
    <Router>
      <App />
    </Router>
  );
});

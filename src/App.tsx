import React from 'react';
import './App.css';
import Navigation from './Navigation';
import { store } from './services/state';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;

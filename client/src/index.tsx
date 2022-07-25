import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Router } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import { StoreContextProvider } from './app/context/StoreContext';
import { configureStore } from './app/store/configureStore';
import { Provider } from 'react-redux';

export const history = createBrowserHistory();
const store = configureStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router history={history}>
    <React.StrictMode>
      <StoreContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </StoreContextProvider>
    </React.StrictMode>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


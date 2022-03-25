import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './store/reducers';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const persistConfig = {
  key: 'root',
  storage,
}
const LoadingView = () => (<div>loading</div>)

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer, composeWithDevTools(
  applyMiddleware()
));
let persistor = persistStore(store)

ReactDOM.render(<Provider store={store}>
  <PersistGate loading={<LoadingView />} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>,
  document.getElementById('root'));

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
// import index.js reducer file
import rootReducer from './reducers';

const initialSate = {};
const middleware = [thunk];
const store = createStore(
  rootReducer,
  initialSate,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

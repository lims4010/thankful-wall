import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import wall from './wall';

export default combineReducers({
  alert,
  auth,
  wall
});

import { combineReducers } from 'redux';

import authReducer from "../reducers/authReducer"
import homeReducer from "../reducers/homeReducer"

// Combine all the reducers
const rootReducer = combineReducers({ authReducer, homeReducer });

export default rootReducer;

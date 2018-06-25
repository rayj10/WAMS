import { combineReducers } from 'redux';

import authReducer from "../reducers/authReducer"
import workspaceReducer from "../reducers/workspaceReducer"
import menuReducer from "../reducers/menuReducer"

// Combine all the reducers
const rootReducer = combineReducers({ authReducer, workspaceReducer, menuReducer });

export default rootReducer;

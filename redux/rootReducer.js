import { combineReducers } from 'redux';

import authReducer from "../reducers/authReducer"
import workspaceReducer from "../reducers/workspaceReducer"

// Combine all the reducers
const rootReducer = combineReducers({ authReducer, workspaceReducer });

export default rootReducer;

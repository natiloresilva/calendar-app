import { combineReducers } from 'redux'
import { uiReducer } from './uiReducer'



export const rootReducer = combineReducers({
    ui: uiReducer,
    // TODO: calendar: calendarReducer
    // TODO: AuthReducer
})

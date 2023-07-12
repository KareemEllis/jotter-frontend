import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import userReducer from'./reducers/userReducer'
import noteReducer from './reducers/noteReducer'
import labelReducer from './reducers/labelReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    notes: noteReducer,
    labels: labelReducer
  },
  middleware: [thunk]
})

export default store
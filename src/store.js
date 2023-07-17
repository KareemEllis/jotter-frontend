import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import userReducer from'./reducers/userReducer'
import noteReducer from './reducers/noteReducer'
import labelReducer from './reducers/labelReducer'
import snackBarReducer from './reducers/snackBarReducer'
import noteDialogReducer from './reducers/noteDialogReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    notes: noteReducer,
    labels: labelReducer,
    snackBar: snackBarReducer,
    noteDialog: noteDialogReducer
  },
  middleware: [thunk]
})

export default store
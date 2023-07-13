import { createSlice } from '@reduxjs/toolkit'

const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState: {
    message: '',
    open: false
  },
  reducers: {
    setSnackBar(state, action) {
      return action.payload
    }
  }
})

export const openSnackBar = (message) => {
  return async dispatch => {
    await dispatch(setSnackBar({
      message,
      open: true
    }))
  }
}

export const closeSnackBar = () => {
  return async dispatch => {
    await dispatch(setSnackBar({
      message: '',
      open: false
    }))
  }
}

export const { setSnackBar } = snackBarSlice.actions

export default snackBarSlice.reducer
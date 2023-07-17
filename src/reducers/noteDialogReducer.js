import { createSlice } from '@reduxjs/toolkit'

const noteDialogSlice = createSlice({
  name: 'noteDialog',
  initialState: {
    noteId: null,
    open: false
  },
  reducers: {
    setNoteDialog(state, action) {
      return action.payload
    },
    unsetNoteDialog(state, action) {
      return {
        noteId: null,
        open: false
      }
    }
  }
})

export const openNoteDialog = (noteId) => {
  return async dispatch => {
    await dispatch(setNoteDialog({
      noteId: noteId,
      open: true
    }))
  }
}

export const closeNoteDialog = () => {
  return async dispatch => {
    await dispatch(unsetNoteDialog())
  }
}

export const { setNoteDialog, unsetNoteDialog } = noteDialogSlice.actions

export default noteDialogSlice.reducer
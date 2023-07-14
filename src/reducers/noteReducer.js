import { createSlice } from '@reduxjs/toolkit'

import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    setNotes(state, action) {
      return action.payload
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    removeNote(state, action) {
      const id = action.payload
      return state.filter(note => note.id !== id)
    },
    patchNote(state, action) {
      const updatedNote = action.payload
      return state.map((note) => (note.id == updatedNote.id ? updatedNote : note))
    }
  }
})
  
export const initializeNotes = () => {
  return async dispatch => {
    await noteService.getAll()
      .then(notes => dispatch(setNotes(notes)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}
  
export const setNewNotes = (notes) => {
  return async dispatch => {
    dispatch(setNotes(notes))
  }
}
export const createNote = (title, details, labels, pinned, backgroundColor) => {
  const note = {
    title,
    details,
    labels,
    pinned,
    backgroundColor
  }
  return async dispatch => {
    await noteService.create(note)
      .then(newNote => dispatch(appendNote(newNote)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const deleteNote = (id) => {
  return async dispatch => {
    await noteService.remove(id)
      .then(() => dispatch(removeNote(id)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const updateNote = (id, title, details, labels, pinned, backgroundColor) => {
  const updatedNote = {
    id,
    title,
    details,
    labels,
    pinned,
    backgroundColor
  }
  return async dispatch => {
    await noteService.update(id, updatedNote)
      .then(note => dispatch(patchNote(note)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const addLabel = (id, label) => {
  return async (dispatch, getState) => {
    const state = getState()
    console.log(state)
    const noteToUpdate = state.notes.find(note => note.id == id)
    const updatedNote = {
      ...noteToUpdate, 
      labels: [...noteToUpdate.labels, label] 
    }

    await noteService.update(id, updatedNote)
      .then(note => dispatch(patchNote(note)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const removeLabel = (id, label) => {
  return async (dispatch, getState) => {
    const state = getState()
    const noteToUpdate = state.notes.find(note => note.id == id)
    const updatedNote = {
      ...noteToUpdate, 
      labels: noteToUpdate.labels.filter(l => l != label)
    }

    await noteService.update(id, updatedNote)
      .then(note => dispatch(patchNote(note)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const removeLabelFromAll = (label) => {
  return async (dispatch, getState) => {
    const state = getState()
    
    const notesWithLabel = state.notes.filter(note => note.labels.some(l => l == label))
    const notes = notesWithLabel.map((note) => {
      if(note.labels.some(l => l == label)){
        return {
          ...note,
          labels: note.labels.filter(l => l != label)
        }
      }
    })
    await Promise.all(
      notes.map(async (note) => {
        await noteService.update(note.id, note)
        dispatch(patchNote(note))
      })
    )
  }
}

export const togglePin = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const noteToUpdate = state.notes.find(note => note.id == id)
    const updatedNote = {
      ...noteToUpdate, 
      pinned: !noteToUpdate.pinned
    }

    await noteService.update(id, updatedNote)
      .then(note => dispatch(patchNote(note)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const updateBackgroundColor = (id, color) => {
  return async (dispatch, getState) => {
    const state = getState()
    const noteToUpdate = state.notes.find(note => note.id == id)
    const updatedNote = {
      ...noteToUpdate, 
      backgroundColor: color
    }

    await noteService.update(id, updatedNote)
      .then(note => dispatch(patchNote(note)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}
  
export const { setNotes, appendNote, removeNote, patchNote } = noteSlice.actions
  
export default noteSlice.reducer
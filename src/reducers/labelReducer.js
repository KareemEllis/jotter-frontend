import { createSlice } from '@reduxjs/toolkit'

import labelService from '../services/labels'

const labelSlice = createSlice({
  name: 'labels',
  initialState: [],
  reducers: {
    setLabels(state, action) {
      return action.payload
    },
    appendLabel(state, action) {
      state.push(action.payload)
    },
    removeLabel(state, action) {
      const id = action.payload
      return state.filter(label => label.id != id)
    },
    patchLabel(state, action) {
      const updatedLabel = action.payload
      return state.map((label) => (label.id == updatedLabel.id ? updatedLabel : label))
    }
  }
})

export const initializeLabels = () => {
  return async dispatch => {
    labelService.getAll()
      .then(labels => dispatch(setLabels(labels)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const createLabel = (name) => {
  return async dispatch => {
    await labelService.create({ name })
      .then(newLabel => dispatch(appendLabel(newLabel)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const deleteLabel = (id) => {
  return async dispatch => {
    await labelService.remove(id)
      .then(() => dispatch(removeLabel(id)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const updateLabel = (id, name) => {
  const updatedLabel = {
    id,
    name
  }
  return async dispatch => {
    await labelService.update(id, updatedLabel)
      .then(label => dispatch(patchLabel(label)))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const { setLabels, appendLabel, removeLabel, patchLabel } = labelSlice.actions

export default labelSlice.reducer
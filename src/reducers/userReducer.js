import { createSlice } from '@reduxjs/toolkit'
import { setJwt, setUser } from '../config'

import userService from '../services/users'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUserData(state, action) {
      return action.payload
    },
    unsetUserData(state, action) {
      return null
    }
  }
})

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = await window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const userInfo = JSON.parse(loggedUserJSON)
      dispatch(setUserData({
        name: userInfo.name,
        username: userInfo.username
      })) 
    }
  }
}

export const loginUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await userService.login(username, password)
      const userObj = {
        name: user.name, 
        username: user.username
      }
      await dispatch(setUserData(userObj))
    } 
    catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

export const logoutUser = () => {
  return async dispatch => {
    await userService.logout()
      .then(() => dispatch(unsetUserData()))
      .catch(error => {
        console.log(error)
        throw new Error(error.message)
      })
  }
}

export const { setUserData, unsetUserData } = userSlice.actions

export default userSlice.reducer
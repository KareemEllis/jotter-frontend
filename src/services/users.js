import axios from 'axios'
import { setJwt } from '../config'

const baseUrl = '/api/users'

const create = async (name, username, password) => {
  try {
    const newUser = {
      name,
      username,
      password
    }
    const response = await axios.post(baseUrl, newUser)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.response.data.error)
  }
}

const login = async (username, password) => {
  try {
    const credentials = {
      username,
      password
    }
    const response = await axios.post('/api/login', credentials)
    console.log(response)
    
    await window.localStorage.setItem(
      'loggedUser', JSON.stringify(response.data)
    ) 
    setJwt(response.data.token)

    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.response.status)
  }
}

const logout = async () => {
  await window.localStorage.removeItem('loggedUser')
}

export default {
  create,
  login,
  logout
}
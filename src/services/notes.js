import axios from 'axios'
import { getConfig } from '../config'

const baseUrl = '/api/notes'

const getAll = async () => {
  try {
    const config = {
      headers: { Authorization: getConfig().jwt }
    }
    
    const response = await axios.get(baseUrl, config)
    return response.data
  } 
  catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const get = async (id) => {
  try {
    const config = {
      headers: { Authorization: getConfig().jwt }
    }

    const response = await axios.get(`${baseUrl}/${id}`, config)
    return response.data
  } 
  catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const create = async (newNote) => {
  try {
    const config = {
      headers: { Authorization: getConfig().jwt }
    }

    const response = await axios.post(baseUrl, newNote, config)
    return response.data
  } 
  catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const remove = async (id) => {
  try {
    const config = {
      headers: { Authorization: getConfig().jwt }
    }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  } 
  catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const update = async (id, updatedNote) => {
  try {
    const config = {
      headers: { Authorization: getConfig().jwt }
    }

    const response = await axios.patch(`${baseUrl}/${id}`, updatedNote, config)
    return response.data
  } 
  catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

export default { 
  getAll,
  get,
  create, 
  remove,
  update
}
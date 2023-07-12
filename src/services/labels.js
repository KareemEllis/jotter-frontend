import axios from 'axios'
import { getConfig } from '../config'

const baseUrl = '/api/labels'

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

const create = async (newLabel) => {
  try {
    const config = {
      headers: { Authorization: getConfig().jwt }
    }

    const response = await axios.post(baseUrl, newLabel, config)
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
  
const update = async (id, updatedLabel) => {
  try {
    const config = {
      headers: { Authorization: getConfig().jwt }
    }

    const response = await axios.patch(`${baseUrl}/${id}`, updatedLabel, config)
    return response.data
  } 
  catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}
  
export default { 
  getAll, 
  create, 
  remove,
  update
}
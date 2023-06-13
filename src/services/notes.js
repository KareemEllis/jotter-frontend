import axios from 'axios'

const baseUrl = '/api/notes'

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const get = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const create = async (newNote) => {
  try {
    const response = await axios.post(baseUrl, newNote)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const remove = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const update = async (id, updatedNote) => {
  try {
    const response = await axios.patch(`${baseUrl}/${id}`, updatedNote)
    return response.data
  } catch (error) {
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
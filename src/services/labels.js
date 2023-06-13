import axios from 'axios'

const baseUrl = '/api/labels'

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

const create = async (newLabel) => {
  try {
    const response = await axios.post(baseUrl, newLabel)
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
  
const update = async (id, updatedLabel) => {
  try {
    const response = await axios.patch(`${baseUrl}/${id}`, updatedLabel)
    return response.data
  } catch (error) {
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
import axios from 'axios'

const baseUrl = '/api/labels'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newLabel) => {
  const response = await axios.post(baseUrl, newLabel)
  return response.data
}
  
const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}
  
const update = async (id, updatedLabel) => {
  const response = await axios.patch(`${baseUrl}/${id}`, updatedLabel)
  return response.data
}
  
export default { 
  getAll, 
  create, 
  remove,
  update
}
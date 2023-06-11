import axios from "axios"

const baseUrl = '/api/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data
}

const get = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data
}

const create = async (newNote) => {
  const response = await axios.post(baseUrl, newNote)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

const update = async (id, updatedNote) => {
  const response = await axios.patch(`${baseUrl}/${id}`, updatedNote)
  return response.data
}

export default { 
  getAll,
  get,
  create, 
  remove,
  update
}
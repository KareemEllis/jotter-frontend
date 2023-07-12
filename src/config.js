let jwt = null
let user = null

const setJwt = (token) => {
  jwt = `Bearer ${token}`
}
const setUser = (userInfo) => {
  user = userInfo
}

const loggedUserJSON = window.localStorage.getItem('loggedUser')
if (loggedUserJSON) {
  const userInfo = JSON.parse(loggedUserJSON)
  setJwt(userInfo.token)
  setUser(userInfo)
}

const getConfig = () => {
  return {
    jwt: jwt,
    user: user
  }
}

export { setJwt, setUser, getConfig }
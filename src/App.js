import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import Layout from './components/Layout'
import Notes from './pages/Notes'
import Create from './pages/Create'
import EditNote from './pages/EditNote'
import Login from './pages/Login'
import EditLabels from './pages/EditLabels'
import Register from './pages/Register'

import { initializeUser } from './reducers/userReducer'
import { initializeLabels } from './reducers/labelReducer'
import { initializeNotes } from './reducers/noteReducer'
import { useDispatch, useSelector } from 'react-redux'

function App() {
  const labels = useSelector(state => state.labels)
  const user = useSelector(state => state.user)
  const [userLoaded, setUserLoaded] = useState(false)
  let isInitialized = user ? true : false
  console.log('User:')
  console.log(user)
  console.log(`isInitialized: ${isInitialized}`)

  const [snackBarMsg, setSnackBarMsg] = useState('')
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => { 
    const initializeData = async () => {
      if(!isInitialized) {
        isInitialized = true
        await dispatch(initializeUser())
        setUserLoaded(true)
      }
      
      if(user) {
        dispatch(initializeLabels())
        dispatch(initializeNotes())
      }
    }

    initializeData()
  }, [user])

  const showSnackBar = (message) => {
    setSnackBarMsg(message)
    setSnackBarOpen(true)
  }
  
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackBarOpen(false)
  }

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleSnackClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  return (
    <Router>
      <Routes>

        <Route 
          path='/login'
          element={<Login />}
        />

        <Route 
          path='/register'
          element={<Register />}
        />

        <Route 
          path="/" 
          element={
            <Layout userLoaded={userLoaded}>
              <Notes labelToView="" />
            </Layout>
          } 
        />

        <Route 
          path='/create' 
          element={
            <Layout userLoaded={userLoaded}>
              <Create />
            </Layout>
          } 
        />

        <Route 
          path='/note/:noteId'
          element={
            <Layout userLoaded={userLoaded}>
              <EditNote />
            </Layout>
          }
        />

        <Route 
          path="/labels" 
          element={
            <Layout userLoaded={userLoaded}>
              <EditLabels />
            </Layout>
          } 
        />

        {
          //ROUTES FOR LABELS
          labels.map(label => (
            <Route 
              key={label.id}
              path={`/label/${label.id}`} 
              element={
                <Layout userLoaded={userLoaded}>
                  <Notes labelToView={label} />
                </Layout>
              } 
            />
          ))
        }
      </Routes>

      <Snackbar
        open={snackBarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackClose}
        message={snackBarMsg}
        action={action}
      />
    </Router>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Notes from './pages/Notes'
import labelService from './services/labels'
import Create from './pages/Create'
import Layout from './components/Layout'
import EditLabels from './pages/EditLabels'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function App() {
  const [allLabels, setAllLabels] = useState([])

  const [snackBarMsg, setSnackBarMsg] = useState('')
  const [snackBarOpen, setSnackBarOpen] = useState(false)

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

  useEffect(() => { 
    // Fatch Labels
    labelService
      .getAll()
      .then(data => setAllLabels(data))
      .catch(error => {
        console.log(error)
        setSnackBarOpen(true)
        setSnackBarMsg('Network Error')
      })
  }, [])

  return (
    <Router>
      <Layout labels={allLabels}>
        <Routes>
          <Route 
            path="/" 
            element={<Notes allLabels={allLabels} labelToView="" />} 
          />
          <Route 
            path="/create" 
            element={<Create />} 
          />
          <Route 
            path="/labels" 
            element={<EditLabels allLabels={allLabels} setAllLabels={setAllLabels} />} 
          />
          {
            //ROUTES FOR LABELS
            allLabels.map(label => {
              return(
                <Route 
                  key={label.id}
                  path={`/label/${label.id}`} 
                  element={<Notes allLabels={allLabels} labelToView={label} />} 
                />
              )
            })
          }
        </Routes>
      </Layout>

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

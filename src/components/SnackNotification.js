import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { closeSnackBar } from '../reducers/snackBarReducer'
import { useDispatch, useSelector } from 'react-redux'

function SnackNotification() {
  const dispatch = useDispatch()
  const snackBar = useSelector(state => state.snackBar)
    
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch(closeSnackBar())
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

  return  (
    <Snackbar
      open={snackBar.open} 
      autoHideDuration={6000} 
      onClose={handleSnackClose}
      message={snackBar.message}
      action={action}
    />
  )
}

export default SnackNotification
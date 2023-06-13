import noteService from '../services/notes'

import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useNavigate } from 'react-router-dom'

export default function Create() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [detailsError, setDetailsError] = useState(false)
  const [titleHelperText, setTitleHelperText] = useState('')
  const [detailsHelperText, setDetailsHelperText] = useState('')

  const [snackBarMsg, setSnackBarMsg] = useState('')
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackBarOpen(false)
  }

  const showSnackBar = (message) => {
    setSnackBarMsg(message)
    setSnackBarOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTitleError(false)
    setDetailsError(false)
    setTitleHelperText('')
    setDetailsHelperText('')

    if (title == '') {
      setTitleError(true)
      setTitleHelperText('Field cannot be left blank.')
    }
    if (details == '') {
      setDetailsError(true)
      setDetailsHelperText('Field cannot be left blank.')
    }
    if (title && details) {
      const newNote = { title, details, pinned: false, labels: [] }
      noteService
        .create(newNote)
        .then(() => {
          showSnackBar('Successfully created note!')
          navigate('/')
        })
        .catch(error => {
          console.log(error)
          showSnackBar('Failed to create note.')
        })
    } 
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
    <Container size="sm">
      <Typography
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Create a New Note
      </Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          label="Note Title" 
          variant="outlined" 
          color="secondary" 
          fullWidth
          required
          error={titleError}
          helperText={titleHelperText}
          margin="normal"
        />
        <TextField
          onChange={(e) => setDetails(e.target.value)}
          label="Details"
          variant="outlined"
          color="secondary"
          multiline
          rows={4}
          fullWidth
          required
          error={detailsError}
          helperText={detailsHelperText}
          margin="normal"
        />

        <Button
          type="submit" 
          color="secondary" 
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}
          margin="normal"
        >
          Submit
        </Button>
      </form>

      <Snackbar
        open={snackBarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackClose}
        message={snackBarMsg}
        action={action}
      />

    </Container>
  )
}
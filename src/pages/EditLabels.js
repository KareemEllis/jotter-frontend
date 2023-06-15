/* eslint-disable react/prop-types */
import labelService from '../services/labels'

import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'

export default function EditLabels({ allLabels, setAllLabels }) {
  const [newLabel, setNewLabel] = useState('')
  const [newLabelError, setNewLabelError] = useState(false)
  const [labelNameHelperText, setLabelNameHelperText] = useState('')
  const [newLabelLoading, setNewLabelLoading] = useState(false)

  const [allLabelErrors, setAllLabelErrors] = useState([])
  const [allHelperTexts, setAllHelperTexts] = useState([])
  const [allLoading, setAllLoading] = useState([])

  const [snackBarMsg, setSnackBarMsg] = useState('')
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  

  //Set up error, helper text and loading animation states for labels to be edited
  useEffect(() => {
    if (allLabels.length > 0) {
      setAllLabelErrors(
        allLabels.map(label => {
          return {
            id: label.id,
            error: false
          }
        })
      )
      setAllHelperTexts(
        allLabels.map(label => {
          return {
            id: label.id,
            text: ''
          }
        })
      )
      setAllLoading(
        allLabels.map(label => {
          return {
            id: label.id,
            bool: false
          }
        })
      )
    }
  }, [allLabels])

  //Change the state of a label's loading animation
  const changeLoadState = (label, bool) => {
    const animations = allLoading.map(loading => {
      if (loading.id == label.id) {
        return {
          id: label.id,
          bool: bool
        }
      }
      else {
        return loading
      }
    })
    setAllLoading(animations)
  } 

  //Handle closing of the snackbar
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

  //Submit event for creating a new label
  const handleSubmit = (e) => {
    e.preventDefault()
    setNewLabelError(false)
    setLabelNameHelperText('')

    const labelAlreadyExists = allLabels.some(l => l.name === newLabel)

    if (newLabel === '') {
      setNewLabelError(true)
      setLabelNameHelperText('Field cannot be left blank.')
    }
    if (labelAlreadyExists) {
      setNewLabelError(true)
      setLabelNameHelperText('This label already exists.')
    }

    if (newLabel !== '' && !labelAlreadyExists) {
      const newLabelObj = { 'name': newLabel }
      setNewLabelLoading(true)

      labelService
        .create(newLabelObj)
        .then((returnedLabel) => {
          console.log(returnedLabel)
          const newLabels = [...allLabels, returnedLabel]
          setAllLabels(newLabels)
          setNewLabel('')
          showSnackBar('Successfully created label!')
          setNewLabelLoading(false)
        })
        .catch(error => {
          //Error Alert
          console.log(error)
          showSnackBar('Failed to create label.')
          setNewLabelLoading(false)
        })
    } 
  }

  //Delete label
  const handleDelete = (e, label) => {
    changeLoadState(label, true)

    labelService
      .remove(label.id)
      .then(() => {
        const newLabels = allLabels.filter(l => l.id != label.id)
        setAllLabels(newLabels)
        setSnackBarOpen(true)
        setSnackBarMsg('Successfully deleted label!')
        changeLoadState(label, false)
      })
      .catch(error => {
        console.log(error)
        showSnackBar('Failed to delete label.')
        changeLoadState(label, false)
      })
      //Handle Removing the deleted label from notes at server-side
  }

  //Event handler for editing a label
  const handleLabelNameChange = async (newText, label) => {
    //Change the error state for edited label
    const changeErrorState = (bool) => {
      const errors = allLabelErrors.map(labelError => {
        if (labelError.id == label.id) {
          return {
            id: label.id,
            error: bool
          }
        }
        else {
          return labelError
        }
      })
      setAllLabelErrors(errors)
    } 
    //Change the helper text for the edited label
    const changeHelperText = (text) => {
      const texts = allHelperTexts.map(helperText => {
        if(helperText.id == label.id) {
          return {
            id: label.id,
            text: text
          }
        }
        else {
          return helperText
        }
      })
      setAllHelperTexts(texts)
    }

    const labelAlreadyExists = allLabels.some(l => l.name === newText) && newText != label.name
    changeErrorState(false)
    changeHelperText('')

    //Check if label is empty
    if(newText == '') {
      console.log('Cannot be empty')
      changeErrorState(true)
      changeHelperText('Field cannot be left blank.')
    }

    //Check if label already exists
    if(labelAlreadyExists) {
      console.log('Already Exists')
      changeErrorState(true)
      changeHelperText('This label already exists.')
    }
  }

  const handleBlur = (newText, label) => {
    const labelAlreadyExists = allLabels.some(l => l.name === newText) && newText != label.name

    if(newText != '' && !labelAlreadyExists) {
      const editedLabel = {...label, name: newText}
      changeLoadState(label, true)

      labelService
        .update(label.id, editedLabel)
        .then(() => {
          showSnackBar('Successfully edited label!')
          // Update state with label
          let newLabels = allLabels.map((l) => (l.id === label.id ? editedLabel : l))
          setAllLabels(newLabels)
          changeLoadState(label, false)
        })
        .catch(error => {
          // Error Alert
          console.error(error)
          showSnackBar('Failed to edit label.')
          changeLoadState(label, false)
        })
    }
  }

  // Action for Snackbar
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
        Create New Labels
      </Typography>

      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          label="New Label" 
          variant="outlined" 
          color="secondary" 
          fullWidth
          sx={{ maxWidth: '500px', display: 'block' }}
          error={newLabelError}
          helperText={labelNameHelperText}
          margin="normal"
        />

        <Button
          type="submit" 
          color="secondary" 
          variant="contained"
          endIcon={ newLabelLoading ? <CircularProgress color="inherit" size={20} /> : <KeyboardArrowRightIcon />}
          margin="normal"
        >
          Create
        </Button>
      </form>

      <Typography
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
        sx={{ marginTop: '15px' }}
      >
        Edit Labels
      </Typography>
      {
        allLabels.map(label => {
          //Get the error state for current label
          const labelError = allLabelErrors.find(item => item.id == label.id)
          //Get the helper text state for current label
          const helperText = allHelperTexts.find(item => item.id == label.id)
          //Get the loading animation for current label
          const loading = allLoading.find(item => item.id == label.id)

          return (
            <Box 
              key={label.name}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Tooltip title="Delete Label">
                <IconButton
                  onClick={(e) =>handleDelete(e, label)}
                  color='secondary'
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            
              <TextField
                onChange={(e) => handleLabelNameChange(e.target.value.trim(), label)}
                onBlur={(e) => handleBlur(e.target.value.trim(), label)}
                defaultValue={label.name}
                placeholder="Label Name" 
                variant="outlined" 
                color="secondary" 
                fullWidth
                sx={{ maxWidth: '500px' }}
                error={labelError ? labelError.error : false}
                helperText={helperText ? helperText.text : ''}
                margin="normal"
              />
              {loading ?
                loading.bool ? <CircularProgress color="secondary" size={25} /> : ''
                :
                ''
              }
            </Box>
          )
          
        })
      }

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
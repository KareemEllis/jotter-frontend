/* eslint-disable react/prop-types */
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
import CircularProgress from '@mui/material/CircularProgress'

import { openSnackBar } from '../reducers/snackBarReducer'
import { useDispatch, useSelector } from 'react-redux'
import { createLabel, deleteLabel, updateLabel } from '../reducers/labelReducer'
import { removeLabelFromAll } from '../reducers/noteReducer'

export default function EditLabels() {
  const dispatch = useDispatch()

  const [newLabel, setNewLabel] = useState('')
  const [newLabelError, setNewLabelError] = useState(false)
  const [labelNameHelperText, setLabelNameHelperText] = useState('')
  const [newLabelLoading, setNewLabelLoading] = useState(false)

  const [allLabelErrors, setAllLabelErrors] = useState([])
  const [allHelperTexts, setAllHelperTexts] = useState([])
  const [allLoading, setAllLoading] = useState([])

  const allLabels = useSelector(state => state.labels)

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

  //Submit event for creating a new label
  const handleSubmit = async (e) => {
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
      try {
        setNewLabelLoading(true)
        await dispatch(createLabel(newLabel))
        setNewLabel('')
        setNewLabelLoading(false)
      } 
      catch (error) {
        console.log(error)
        setNewLabelLoading(false)
        dispatch(openSnackBar('Failed to create new label.'))
      }
    } 
  }

  //Delete label
  const handleDelete = async (e, label) => {
    try {
      changeLoadState(label, true)
      await dispatch(deleteLabel(label.id))
      await dispatch(removeLabelFromAll(label.id))
      changeLoadState(label, false)
    } 
    catch (error) {
      console.log(error)
      changeLoadState(label, false)
      dispatch(openSnackBar('Failed to delete label.'))
    }
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

  const handleBlur = async (newText, label) => {
    const labelAlreadyExists = allLabels.some(l => l.name === newText) && newText != label.name

    if(newText != '' && !labelAlreadyExists) {
      try {
        changeLoadState(label, true)
        await dispatch(updateLabel(label.id, newText))
        changeLoadState(label, false)
        dispatch(openSnackBar('Edited Label'))
      } 
      catch (error) {
        console.error(error)
        changeLoadState(label, false)
        dispatch(openSnackBar('Failed to edit label.'))
      }
    }
  }

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
                  color='error'
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
              {loading &&
                loading.bool && <CircularProgress color="secondary" size={25} />
              }
            </Box>
          )
          
        })
      }

    </Container>
  )
}
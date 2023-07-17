import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import DeleteIcon from '@mui/icons-material/Delete'
import FormControlLabel from '@mui/material/FormControlLabel'
import Input from '@mui/material/Input'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import { darken } from '@mui/material/styles'
import ToggleButton from '@mui/material/ToggleButton'
import CircularProgress from '@mui/material/CircularProgress'
import ColorPicker from '../components/ColorPicker'
import { getContrastText } from '../utils/contrastColors'

import { useNavigate } from 'react-router-dom'
import { openSnackBar } from '../reducers/snackBarReducer'
import { createNote } from '../reducers/noteReducer'
import { useDispatch, useSelector } from 'react-redux'

export default function Create() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allLabels = useSelector(state => state.labels)

  const [pinned, setPinned] = useState(false)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [labels, setLabels] = useState([])
  const [bgColor, setBgColor] =useState('#FFFFFF')
  const [file, setFile] = useState(null)

  const [filePreview, setFilePreview] = useState(null)

  const [titleError, setTitleError] = useState(false)
  const [detailsError, setDetailsError] = useState(false)
  const [titleHelperText, setTitleHelperText] = useState('')
  const [detailsHelperText, setDetailsHelperText] = useState('')
  
  const [loading, setLoading] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)
  //Handle Opening the Card Menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview)
      }
    }
  }, [filePreview])

  const handleColorChange = (newColor) => {
    setBgColor(newColor)
  }

  //Handle Changind the cards labels
  const handleLabelChange = async (event, label) => {
    const checked = event.target.checked

    if (checked) {
      setLabels(prev => [...prev, label.id])
    } 
    else {
      setLabels(prev => prev.filter(l => l != label.id))
    }
  }

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (file && allowedFormats.includes(file.type) && file.size <= maxSize) {
      setFile(file)
      setFilePreview(URL.createObjectURL(file))
    } else {
      dispatch(openSnackBar('Invalid file format or size exceeded (max 5MB).'))
    }
  }

  const removeFile = () => {
    setFile(null)
    setFilePreview(null)
  }

  const handleSubmit = async (e) => {
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
      setLoading(true)
      try {
        await dispatch(createNote(title, details, labels, pinned, bgColor, file))
        setLoading(false)
        dispatch(openSnackBar('Created note.'))

        //Cleanup file preview object
        URL.revokeObjectURL(filePreview)
        setFilePreview(null)
        navigate('/')
      } 
      catch (error) {
        dispatch(openSnackBar('Failed to create note.'))
        console.log(error)
        setLoading(false)
      }
    } 
  }

  const labelCheckBoxes = allLabels.map(label => (
    <div key={label.name}>
      <FormControlLabel
        control={<Checkbox />}
        label={label.name}
        onChange={event => handleLabelChange(event, label)}
        
      />
    </div>
  ))

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
        {/* //Button To toggle note being pinned */}
        <ToggleButton
          value="check"
          selected={pinned}
          onChange={() => setPinned(prev => !prev)}
        >
          { pinned ? <PushPinIcon /> : <PushPinOutlinedIcon /> }
        </ToggleButton>

        {/* //Color Picker Menu */}
        <div>
          <Button 
            onClick={handleMenuClick}
            variant="contained"
            sx={{ 
              marginTop: '15px',
              backgroundColor: bgColor,
              color: bgColor && getContrastText(bgColor),
              ':hover': {
                backgroundColor: bgColor && typeof bgColor === 'string' ? darken(bgColor, 0.2) : bgColor,
              },
            }}
          >
            {bgColor}
          </Button>
        </div>
        
        {/* //Photo File Selection */}
        <div style={{ marginTop: '15px' }}>
          <Input
            id="file-input"
            type="file"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input">
            <Button variant="contained" color='secondary' component="span">
              Choose Photo
            </Button>
          </label>
          <Button onClick={() => removeFile()}>
            <DeleteIcon color='secondary'/>
          </Button>
          {filePreview && (
            <div style={{ marginTop: '15px' }}>
              <img src={filePreview} alt="File Preview" style={{ maxWidth: '500px', maxHeight: '300px' }} />
            </div>
          )}
        </div>

        {/* //Note Title input */}
        <div style={{ maxWidth: 600 }}>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            label="Note Title" 
            variant="outlined" 
            color="secondary" 
            multiline
            fullWidth
            required
            error={titleError}
            helperText={titleHelperText}
            margin="normal"
          />
        </div>

        {/* //Note Details input */}
        <div style={{ maxWidth: 900 }}>
          <TextField
            onChange={(e) => setDetails(e.target.value)}
            label="Details"
            variant="outlined"
            color="secondary"
            multiline
            fullWidth
            required
            error={detailsError}
            helperText={detailsHelperText}
            margin="normal"
          />
        </div>

        { labelCheckBoxes }

        {/* //Submit Button */}
        <Button
          type="submit" 
          variant="contained"
          endIcon={ loading ? <CircularProgress color="inherit" size={20} /> : <KeyboardArrowRightIcon />}
          margin="normal"
        >
          Submit
        </Button>
      </form>


      <ColorPicker 
        color={bgColor}
        handleColorChange={handleColorChange}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </Container>
  )
}
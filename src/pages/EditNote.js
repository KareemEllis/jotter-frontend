import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import DeleteIcon from '@mui/icons-material/Delete'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import FormControlLabel from '@mui/material/FormControlLabel'
import Input from '@mui/material/Input'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import { darken } from '@mui/material/styles'
import { getContrastText } from '../utils/contrastColors'
import ToggleButton from '@mui/material/ToggleButton'
import CircularProgress from '@mui/material/CircularProgress'
import ColorPicker from '../components/ColorPicker'

import { useNavigate, useParams } from 'react-router-dom'
import { openSnackBar } from '../reducers/snackBarReducer'
import { updateNote } from '../reducers/noteReducer'
import { useDispatch, useSelector } from 'react-redux'

export default function Create() {
  const { noteId } = useParams()
  const note = useSelector(state => state.notes.find(n => n.id == noteId))

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allLabels = useSelector(state => state.labels)

  const [pinned, setPinned] = useState(false)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [labels, setLabels] = useState([])
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [file, setFile] = useState(null)
  const [isPhotoChanged, setIsPhotoChanged] = useState(false)
  
  const [filePreview, setFilePreview] = useState(null)

  const [titleError, setTitleError] = useState(false)
  const [detailsError, setDetailsError] = useState(false)
  const [titleHelperText, setTitleHelperText] = useState('')
  const [detailsHelperText, setDetailsHelperText] = useState('')

  const [loading, setLoading] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)
  //Handle Opening the Card Menu
  const handleMenuClick = (event) => {
    console.log('Should display Color Picker')
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    if(note) {
      setPinned(note.pinned)
      setTitle(note.title)
      setDetails(note.details)
      setLabels(note.labels)
      setBgColor(note.backgroundColor)
      setFilePreview(note.photoFilename)  
    }
    if (filePreview) {
      URL.revokeObjectURL(filePreview)
    }
  }, [note])

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
      setIsPhotoChanged(true)
      setFilePreview(URL.createObjectURL(file))
    } else {
      dispatch(openSnackBar('Invalid file format or size exceeded (max 5MB).'))
    }
  }

  const removeFile = () => {
    setFile(null)
    setIsPhotoChanged(true)
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
        let isRemovePhoto = (isPhotoChanged && !file) ? true : false

        await dispatch(updateNote(note.id, title, details, labels, pinned, bgColor, file, isRemovePhoto))
        setLoading(false)
        navigate('/')
      } 
      catch (error) {
        console.log(error)
        setLoading(false)
        dispatch(openSnackBar('Failed to edit note.'))
      }
    } 
  }

  const labelCheckBoxes = allLabels.map(label => {
    const checked = labels.some(l => l == label.id)
    return <div key={label.name}>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        value={checked}
        label={label.name}
        onChange={event => handleLabelChange(event, label)}
      />
    </div>
  })

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
        {/* //Pin Control */}
        <ToggleButton
          value={pinned}
          selected={pinned}
          onChange={() => setPinned(prev => !prev)}
        >
          { pinned ? <PushPinIcon /> : <PushPinOutlinedIcon /> }
        </ToggleButton>

        {/* //Color Control */}
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
          {(isPhotoChanged && filePreview) && (
            <div style={{ marginTop: '15px' }}>
              <img src={filePreview} alt="File Preview" style={{ maxWidth: '500px', maxHeight: '300px' }} />
            </div>
          )}
          {(!isPhotoChanged && filePreview) && (
            <div style={{ marginTop: '15px' }}>
              <img src={`/api/photos/${filePreview}`} alt="File Preview" style={{ maxWidth: '500px', maxHeight: '300px' }} />
            </div>
          )}
        </div>
        
        {/* //Title Control */}
        <div style={{ maxWidth: 600 }}>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            value={title}
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
        {/* //Details Control */}
        <div style={{ maxWidth: 900 }}>
          <TextField
            onChange={(e) => setDetails(e.target.value)}
            value={details}
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
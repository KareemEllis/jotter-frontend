import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { darken} from '@mui/material/styles'
import { getContrastText, getContrastChip, getNoteButtonColor } from '../utils/contrastColors'
import CardLabelMenu from './CardLabelMenu'
import Chip from '@mui/material/Chip'
import ColorPicker from './ColorPicker'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

//DIALOG
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

//ICONS
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import EditIcon from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

import { openSnackBar } from '../reducers/snackBarReducer'
import { removeLabel, updateBackgroundColor, deleteNote, togglePin  } from '../reducers/noteReducer'
import { useDispatch, useSelector } from 'react-redux'
import { openNoteDialog, closeNoteDialog } from '../reducers/noteDialogReducer'

export default function NoteDialog() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [scroll, setScroll] = React.useState('paper')

  const {noteId, open} = useSelector(state => state.noteDialog)
  const note = useSelector(state => state.notes.find(n => n.id == noteId))
  const labels = useSelector(state => state.labels)

  const handleDialogClose = () => {
    dispatch(closeNoteDialog())
  }

  //Label Menu Popup
  const [anchorLabelEl, setAnchorLabelEl] = useState(null)

  //Handle Opening the Card Label Menu
  const handleLabelMenuClick = (event) => {
    setAnchorLabelEl(event.currentTarget)
  }

  const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null)

  //Handle Opening the Color Picker
  const handleChangeColorClick = (event) => {
    setColorPickerAnchorEl(event.currentTarget)
  }

  const handleChangeColor = async (color) => {
    try {
      await dispatch(updateBackgroundColor(note.id, color))
    } catch (error) {
      console.log(error)
      dispatch(openSnackBar('Failed to update color.'))
    }
  }

  //Handle Deleting a Card's label
  const handleLabelDelete = (label) => {
    try {
      dispatch(removeLabel(note.id, label))
      dispatch(openSnackBar('Removed label.'))
    } catch (error) {
      console.log(error)
      dispatch(openSnackBar('Failed to remove label.'))
    }
  }

  //Handle deleting note
  const handleDelete = async () => {
    try {
      await dispatch(deleteNote(note.id))
      dispatch(openSnackBar('Deleted note.'))
    } catch (error) {
      console.log(error)
      dispatch(openSnackBar('Failed to delete note.'))
    }
  }

  const handlePin = async () => {
    try {
      await dispatch(togglePin(note.id))
    } catch (error) {
      console.log(error)
      dispatch(openSnackBar('Failed to change pin.'))
    }
  }

  const goToEditPage = () => {
    handleDialogClose()
    navigate(`/note/${note.id}`)
  }

  const goToLabel = (label) => {
    handleDialogClose()
    navigate(`/label/${label}`)
  }

  return (
    <div>
      {note &&
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleDialogClose}
          aria-labelledby="note-dialog-title"
          aria-describedby="note-dialog-description"
          scroll={scroll}
        > 
          {/* //Display normal Dialog Title if not fullScreen */}
          {!fullScreen &&
            <DialogTitle 
              id="note-dialog-title" 
              sx={{ 
                backgroundColor: note.backgroundColor,
                color: getContrastText(note.backgroundColor)
              }}
            >
              { note.title }
            </DialogTitle>
          }
          {/* //Display App Bar if fullScreen */}
          {fullScreen &&
            <AppBar sx={{ position: 'relative', backgroundColor: note.backgroundColor }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleDialogClose}
                  aria-label="close"
                >
                  <CloseIcon sx={{color: getContrastText(note.backgroundColor)}}/>
                </IconButton>
                <Typography sx={{ ml: 2, color: getContrastText(note.backgroundColor) }} variant="h6">
                  {note.title}
                </Typography>
              </Toolbar>
            </AppBar>
          }
          

          <DialogContent
            dividers={scroll === 'paper'}
            sx={{ backgroundColor: note.backgroundColor, padding: '0px' }}
          >
            {note.photoFilename &&
              <img src={`/api/photos/${note.photoFilename}`} alt={`Photo for note ${note.title}`} style={{ width: '100%' }} />
            }
            <DialogContentText 
              id="note-dialog-description"
              sx={{ 
                fontSize: '20px',
                padding: '16px 24px',
                color: getContrastText(note.backgroundColor) 
              }}
            >
              
              { note.details }
            </DialogContentText>
            {/* //LABEL CHIPS */}
            <div style={{ padding: '10px 24px' }}>
              {note.labels.map(label => {
                const labelObj = labels.find(l => l.id == label)
                return(
                  <Chip 
                    key={label} 
                    label={labelObj ? labelObj.name : ''} 
                    onClick={() => goToLabel(label)}
                    onDelete={() => handleLabelDelete(label)} 
                    sx={{ 
                      marginTop: '5px',
                      marginRight: '5px',
                      backgroundColor: getContrastChip(note.backgroundColor),
                      ':hover': {
                        backgroundColor: darken(getContrastChip(note.backgroundColor), 0.1),
                      },
                    }} 
                  />
                ) 
              })}
            </div>
          </DialogContent>

          <DialogActions
            sx={{ 
              backgroundColor: note.backgroundColor,
              color: getContrastText(note.backgroundColor) 
            }}
          >

            {/* //Pin Button */}
            <Tooltip title={note.pinned? 'Unpin Note' : 'Pin Note'}>
              <IconButton
                onClick={handlePin}
              >
                {note.pinned ? <PushPinIcon sx={{ color: getNoteButtonColor(note.backgroundColor) }}/> : <PushPinOutlinedIcon sx={{ color: getNoteButtonColor(note.backgroundColor) }}/>}
              </IconButton>
            </Tooltip>

            {/* //Change Color Button */}
            <Tooltip title='Change Color'>
              <IconButton
                onClick={handleChangeColorClick}
              >
                <ColorLensIcon sx={{ color: getNoteButtonColor(note.backgroundColor) }} />
              </IconButton>
            </Tooltip>

            {/* //Edit Note Button */}
            <Tooltip title="Edit Note">
              <IconButton
                onClick={goToEditPage}
              >
                <EditIcon sx={{ color: getNoteButtonColor(note.backgroundColor) }}/>
              </IconButton>
            </Tooltip>

            {/* //Add Label Button */}
            <Tooltip title="Add Label">
              <IconButton
                onClick={(e) => handleLabelMenuClick(e)}
              >
                <AddCircleIcon sx={{ color: getNoteButtonColor(note.backgroundColor) }} />
              </IconButton>
            </Tooltip>

            {/* //Delete Button */}
            <Tooltip title="Delete Note">
              <IconButton
                onClick={handleDelete}
              >
                <Delete sx={{ color: getNoteButtonColor(note.backgroundColor) }}/>
              </IconButton>
            </Tooltip>

          </DialogActions>

          <CardLabelMenu 
            note={note} 
            anchorLabelEl={anchorLabelEl} 
            setAnchorLabelEl={setAnchorLabelEl} 
          />

          <ColorPicker 
            color={note.backgroundcolor}
            handleColorChange={handleChangeColor}
            anchorEl={colorPickerAnchorEl}
            setAnchorEl={setColorPickerAnchorEl}
          />
        </Dialog>

        
      }
    </div>
    
    
  )

}
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import ColorPicker from './ColorPicker'
import { darken} from '@mui/material/styles'
import { getContrastText, getContrastChip, getNoteButtonColor } from '../utils/contrastColors'

//CARD
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

//ICONS
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import CardMenu from './CardMenu'
import CardLabelMenu from './CardLabelMenu'

import { useNavigate } from 'react-router-dom'
import { openSnackBar } from '../reducers/snackBarReducer'
import { removeLabel, updateBackgroundColor  } from '../reducers/noteReducer'
import { openNoteDialog } from '../reducers/noteDialogReducer'
import { useDispatch, useSelector } from 'react-redux'

export default function NoteCard({ note }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const labels = useSelector(state => state.labels)

  //Menu Popup
  const [anchorEl, setAnchorEl] = useState(null)
  
  //Handle Opening the Card Menu
  const handleMenuClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  //Label Menu Popup
  const [anchorLabelEl, setAnchorLabelEl] = useState(null)

  //Handle Opening the Card Label Menu
  const handleLabelMenuClick = (event) => {
    event.stopPropagation()
    setAnchorLabelEl(event.currentTarget)
  }

  const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null)

  //Handle Opening the Color Picker
  const handleChangeColorClick = (event) => {
    setColorPickerAnchorEl(anchorEl)
    setAnchorEl(null)
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
  const handleLabelDelete = (event, label) => {
    event.stopPropagation()

    try {
      dispatch(removeLabel(note.id, label))
      dispatch(openSnackBar('Removed label.'))
    } catch (error) {
      console.log(error)
      dispatch(openSnackBar('Failed to remove label.'))
    }
  }

  const goToLabel = (event, label) => {
    event.stopPropagation()
    navigate(`/label/${label}`)
  }

  return (
    <div>
      <Card 
        elevation={1} 
        sx={{ backgroundColor: note.backgroundColor, cursor: 'pointer' }}
        onClick={() => dispatch(openNoteDialog(note.id))}
      >

        {
          //Card Photo
          note.photoFilename &&
          <CardMedia
            component="img"
            image={note.photoFilename ? `api/photos/${note.photoFilename}` : null}
            alt={`Photo for note ${note.title}`}
            height="240"
          />
        }
        
        <CardHeader
          //CARD MENU
          action={
            <div>
              <Tooltip title="More">
                <IconButton
                  onClick={(e) => handleMenuClick(e)}
                  sx={{ color: getContrastText(note.backgroundColor) }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </div>
          }
          title={note.title}
          sx={{ 
            wordBreak: 'break-word', 
            whiteSpace: 'pre-line',
            color: getContrastText(note.backgroundColor) 
          }}          
        />

        <CardContent>
          <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ 
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
              color: getContrastText(note.backgroundColor)
            }} 
          > 
            { note.details }
          </Typography>
        </CardContent>

        <CardActions>
          <div>
            {note.labels.map(label => {
              const labelObj = labels.find(l => l.id == label)
              return(
                <Chip 
                  key={label} 
                  label={labelObj ? labelObj.name : ''} 
                  onClick={(e) => goToLabel(e, label)}
                  onDelete={(e) => handleLabelDelete(e, label)} 
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
            <Tooltip title="Add Label">
              <IconButton
                onClick={(e) => handleLabelMenuClick(e)}
              >
                <AddCircleIcon sx={{ color: getNoteButtonColor(note.backgroundColor) }} />
              </IconButton>
            </Tooltip>
          </div>
        </CardActions>
      </Card>


      <CardMenu 
        note={note} 
        anchorEl={anchorEl} 
        setAnchorEl={setAnchorEl} 
        handleChangeColorClick={handleChangeColorClick}
      />

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
    </div>
  )
}
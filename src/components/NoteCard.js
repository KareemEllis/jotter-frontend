/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import { darken, lighten } from '@mui/material/styles'

//CARD
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

//ICONS
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import CardMenu from './CardMenu'
import CardLabelMenu from './CardLabelMenu'

import { removeLabel } from '../reducers/noteReducer'
import { useDispatch, useSelector } from 'react-redux'

export default function NoteCard({ note }) {
  const dispatch = useDispatch()
  const labels = useSelector(state => state.labels)

  //Menu Popup
  const [anchorEl, setAnchorEl] = useState(null)
  
  //Handle Opening the Card Menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  //Label Menu Popup
  const [anchorLabelEl, setAnchorLabelEl] = useState(null)

  //Handle Opening the Card Label Menu
  const handleLabelMenuClick = (event) => {
    setAnchorLabelEl(event.currentTarget)
  }

  //Handle Deleting a Card's label
  const handleLabelDelete = (label) => {
    dispatch(removeLabel(note.id, label))
  }

  const getContrastText = (color) => {
    // Remove the '#' symbol from the hex color code
    const hex = color.replace('#', '')
  
    // Convert the hex color code to its numeric representation
    const numericColor = parseInt(hex, 16)
  
    // Calculate the brightness of the color
    const brightness = (numericColor >> 16) + (numericColor >> 8 & 0xff) + (numericColor & 0xff)
  
    // Use black text color if brightness is greater than a threshold, otherwise use white
    return brightness > 400 ? '#000000' : '#ffffff'
  }

  const getContrastChip = (color) => {
    // Remove the '#' symbol from the hex color code
    const hex = color.replace('#', '')
  
    // Convert the hex color code to its numeric representation
    const numericColor = parseInt(hex, 16)
  
    // Calculate the brightness of the color
    const brightness = (numericColor >> 16) + (numericColor >> 8 & 0xff) + (numericColor & 0xff)
  
    // Use black text color if brightness is greater than a threshold, otherwise use white
    return brightness > 400 ? darken(color, 0.08) : darken('#ffffff', 0.02)
  }

  return (
    <div>
      <Card 
        elevation={1} 
        sx={{ backgroundColor: note.backgroundColor }}
      >
        <CardHeader
          //CARD MENU
          action={
            <div>
              <Tooltip title="More">
                <IconButton
                  onClick={handleMenuClick}
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
                  onDelete={() => handleLabelDelete(label)} 
                  sx={{ 
                    marginRight: '5px',
                    backgroundColor: getContrastChip(note.backgroundColor)
                  }} 
                />
              ) 
            })}
            <Tooltip title="Add Label">
              <IconButton
                onClick={handleLabelMenuClick}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </div>
        </CardActions>
      </Card>


      <CardMenu 
        note={note} 
        anchorEl={anchorEl} 
        setAnchorEl={setAnchorEl} 
      />

      <CardLabelMenu 
        note={note} 
        anchorLabelEl={anchorLabelEl} 
        setAnchorLabelEl={setAnchorLabelEl} 
      />
      
      
    </div>
  )
}
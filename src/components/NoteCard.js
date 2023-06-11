/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'

//CARD
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

//INPUTS
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

//ICONS
import IconButton from '@mui/material/IconButton'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export default function NoteCard({ note, updateLabels, allLabels, handleDelete, togglePin }) {

  //Menu Popup
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  
  //Handle Opening the Card Menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  //Handle Closing the Card Menu
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  //Label Menu Popup
  const [anchorLabelEl, setAnchorLabelEl] = useState(null)
  const labelMenuOpen = Boolean(anchorLabelEl)

  //Handle Opening the Card Label Menu
  const handleLabelMenuClick = (event) => {
    setAnchorLabelEl(event.currentTarget)
  }

  //Handle Closing the Card Label Menu
  const handleLabelMenuClose = () => {
    setAnchorLabelEl(null)
  }

  //Handle Changind the cards labels
  const handleLabelChange = (event, label) => {
    const checked = event.target.checked
    if(checked) {
      const newLabels = [...note.labels, label]
      updateLabels(note, newLabels)
    }
    else {
      const newLabels = note.labels.filter(l => l != label)
      updateLabels(note, newLabels)
    }
  }

  //Handle Deleting a Card's label
  const handleLabelDelete = (label) => {
    const newLabels = note.labels.filter(l => l != label)
    updateLabels(note, newLabels)
  }
  
  const labelCheckBoxes = allLabels.map(label => {
    const checked = note.labels.some(noteLabel => noteLabel === label.id)
    return (
      <FormControlLabel
        key={label.name}
        control={<Checkbox checked={checked} />}
        label={label.name}
        onChange={event => handleLabelChange(event, label.id)}
      />
    )
  })

  return (
    <div>
      <Card elevation={1} >
        <CardHeader
          //CARD MENU
          action={
            <div>
              <Tooltip title="More">
                <IconButton
                  onClick={handleMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </div>
          }
          title={note.title}
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary">
            { note.details }
          </Typography>
        </CardContent>

        <CardActions>
          <div>
            {note.labels.map(label => {
              const labelObj = allLabels.find(l => l.id == label)
              return(
                <Chip 
                  key={label} 
                  label={labelObj ? labelObj.name : ''} 
                  onDelete={() => handleLabelDelete(label)} 
                  sx={{ marginRight: '5px' }} 
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

      



      {/* CARD OPTIONS MENU */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem key={'Delete'}  onClick={() => handleDelete(note.id)}>
          <DeleteOutlined />
          Delete
        </MenuItem>
        <MenuItem key={'Pin'}  onClick={() => togglePin(note)}>
          {note.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          {note.pinned ? 'Unpin' : 'Pin'}
        </MenuItem>
      </Menu>

      {/* LABEL MENU */}
      <Menu
        anchorEl={anchorLabelEl}
        open={labelMenuOpen}
        onClose={handleLabelMenuClose}
      >
        <Container>
          <FormGroup>
            {labelCheckBoxes}
          </FormGroup>
        </Container>
      </Menu>
      
    </div>
  )
}
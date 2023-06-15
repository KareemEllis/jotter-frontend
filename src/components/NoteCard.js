/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'

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

export default function NoteCard({ note, updateLabels, allLabels, deleteNote, togglePin }) {

  //Menu Popup
  const [anchorEl, setAnchorEl] = useState(null)
  const [cardMenuLoading, setCardMenuLoading] = useState(false)
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
  const [labelMenuLoading, setLabelMenuLoading] = useState(false)
  const labelMenuOpen = Boolean(anchorLabelEl)
  

  //Handle Opening the Card Label Menu
  const handleLabelMenuClick = (event) => {
    setAnchorLabelEl(event.currentTarget)
  }

  //Handle Closing the Card Label Menu
  const handleLabelMenuClose = () => {
    setAnchorLabelEl(null)
  }

  //Handle deleting note
  const handleDelete = async () => {
    setCardMenuLoading(true)

    try {
      await deleteNote(note.id)
    } catch (error) {
      console.log(error)
    } finally {
      setCardMenuLoading(false)
    }
  }

  const handlePin = async () => {
    setCardMenuLoading(true)

    try {
      await togglePin(note)
    } catch (error) {
      console.log(error)
    } finally {
      setCardMenuLoading(false)
    }
  }

  //Handle Changind the cards labels
  const handleLabelChange = async (event, label) => {
    const checked = event.target.checked
    setLabelMenuLoading(true)

    try {
      if (checked) {
        const newLabels = [...note.labels, label]
        await updateLabels(note, newLabels)
      } else {
        const newLabels = note.labels.filter((l) => l !== label)
        await updateLabels(note, newLabels)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLabelMenuLoading(false)
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
          sx={{ wordBreak: 'break-word' }}
          
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary" sx={{ wordBreak: 'break-word' }} > 
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
        <MenuItem key={'Delete'}  onClick={handleDelete}>
          <DeleteOutlined />
          Delete
        </MenuItem>
        <MenuItem key={'Pin'}  onClick={handlePin}>
          {note.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          {note.pinned ? 'Unpin' : 'Pin'}
        </MenuItem>
        {
          cardMenuLoading ?
            <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}/>
            : 
            ''
        }
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
        {
          labelMenuLoading ?
            <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}/>
            : 
            ''
        }
      </Menu>
      
    </div>
  )
}
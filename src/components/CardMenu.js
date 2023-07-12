/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LinearProgress from '@mui/material/LinearProgress'

import { deleteNote, togglePin } from '../reducers/noteReducer'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

export default function CardMenu({ note, anchorEl, setAnchorEl }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [cardMenuLoading, setCardMenuLoading] = useState(false)
  const open = Boolean(anchorEl)

  //Handle Closing the Card Menu
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  //Handle deleting note
  const handleDelete = async () => {
    setCardMenuLoading(true)

    try {
      await dispatch(deleteNote(note.id))
    } catch (error) {
      console.log(error)
    } finally {
      setCardMenuLoading(false)
    }
  }

  const handlePin = async () => {
    setCardMenuLoading(true)

    try {
      await dispatch(togglePin(note.id))
    } catch (error) {
      console.log(error)
    } finally {
      setCardMenuLoading(false)
    }
  }
  
  const rightMargin = {marginRight: '5px'}

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
    >
      {/* //Pin Control */}
      <MenuItem onClick={handlePin}>
        {note.pinned ? <PushPinIcon sx={rightMargin} /> : <PushPinOutlinedIcon sx={rightMargin} />}
        {note.pinned ? 'Unpin' : 'Pin'}
      </MenuItem>

      {/* //Edit Note */}
      <MenuItem onClick={() => navigate(`/note/${note.id}`)}>
        <EditOutlinedIcon sx={rightMargin}/>
        Edit Note
      </MenuItem>

      {/* //Delete */}
      <MenuItem onClick={handleDelete}>
        <DeleteOutlined sx={rightMargin} />
        Delete
      </MenuItem>
      
      {
        cardMenuLoading ?
          <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}/>
          : 
          ''
      }
    </Menu>
  )
}
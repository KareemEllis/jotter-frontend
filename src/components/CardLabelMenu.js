/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'

import { addLabel, removeLabel } from '../reducers/noteReducer'
import { openSnackBar } from '../reducers/snackBarReducer'
import { useDispatch, useSelector } from 'react-redux'

export default function CardLabelMenu({ note, anchorLabelEl, setAnchorLabelEl }) {
  const dispatch = useDispatch()
  const labels = useSelector(state => state.labels)

  const [labelMenuLoading, setLabelMenuLoading] = useState(false)
  const labelMenuOpen = Boolean(anchorLabelEl)

  //Handle Closing the Card Label Menu
  const handleLabelMenuClose = () => {
    setAnchorLabelEl(null)
  }

  //Handle Changind the cards labels
  const handleLabelChange = async (event, label) => {
    const checked = event.target.checked
    setLabelMenuLoading(true)

    try {
      if (checked) {
        await dispatch(addLabel(note.id, label))
      } else {
        await dispatch(removeLabel(note.id, label))
      }
    } catch (error) {
      console.log(error)
      dispatch(openSnackBar('Failed to edit labels.'))
    } finally {
      setLabelMenuLoading(false)
    }
  }
  
  const labelCheckBoxes = labels.map(label => {
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
        labelMenuLoading &&
        <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}/>
      }
    </Menu>
  )
}
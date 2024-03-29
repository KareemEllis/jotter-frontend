/* eslint-disable react/prop-types */
import React from 'react'
import Menu from '@mui/material/Menu'
import { TwitterPicker } from 'react-color'

export default function ColorPicker({ color, handleColorChange, anchorEl, setAnchorEl }) {
  const open = Boolean(anchorEl)

  const handleMenuClose = () => {
    setAnchorEl(null)
  }


  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
    >
      <TwitterPicker
        color={color}
        onChange={newColor => handleColorChange(newColor.hex)}
      />
    </Menu>
  )
}
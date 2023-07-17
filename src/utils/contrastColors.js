import { darken} from '@mui/material/styles'

const getContrastText = (color) => {
  const hex = color.replace('#', '')
  // Convert the hex color code to its numeric representation
  const numericColor = parseInt(hex, 16)
  // Calculate the brightness of the color
  const brightness = (numericColor >> 16) + (numericColor >> 8 & 0xff) + (numericColor & 0xff)
  // Use black text color if brightness is greater than a threshold, otherwise use white
  return brightness > 400 ? '#000000' : '#ffffff'
}

const getContrastChip = (color) => {
  const hex = color.replace('#', '')
  // Convert the hex color code to its numeric representation
  const numericColor = parseInt(hex, 16)
  // Calculate the brightness of the color
  const brightness = (numericColor >> 16) + (numericColor >> 8 & 0xff) + (numericColor & 0xff)
  // Use black text color if brightness is greater than a threshold, otherwise use white
  return brightness > 400 ? darken(color, 0.08) : darken('#ffffff', 0.02)
}

const getNoteButtonColor = (color) => {
  const hex = color.replace('#', '')
  // Convert the hex color code to its numeric representation
  const numericColor = parseInt(hex, 16)
  // Calculate the brightness of the color
  const brightness = (numericColor >> 16) + (numericColor >> 8 & 0xff) + (numericColor & 0xff)
  // Use black text color if brightness is greater than a threshold, otherwise use white
  return brightness > 400 ? darken(color, 0.4) : darken('#ffffff', 0.02)
}

export { getContrastText, getContrastChip, getNoteButtonColor} 
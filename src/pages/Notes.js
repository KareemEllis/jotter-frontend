/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import NoteCard from '../components/NoteCard'
import Masonry from '@mui/lab/Masonry'
import Typography from '@mui/material/Typography'

import { useSelector } from 'react-redux'

export default function Notes({ labelToView }) {
  const notes = useSelector(state => {
    if(labelToView == '') {
      return state.notes
    }
    return state.notes.filter(note => note.labels.some(label => label === labelToView.id))
  })

  // Pinned Notes
  const pinned = notes.filter(note => note.pinned).map(note => (
    <div key={note.id}>
      <NoteCard 
        note={note} 
      />
    </div>
  ))

  // Unpinned notes
  const unPinned = notes.filter(note => !note.pinned).map(note => (
    <div key={note.id}>
      <NoteCard 
        note={note} 
      />
    </div>
  ))

  return (
    <Container>
      <Typography
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        {labelToView === '' ? 'My Notes' : labelToView.name}
      </Typography>

      {
        // CHECK IF THERE ARE PINNED NOTES
        pinned.length > 0 &&
          <div>
            <Typography variant="subtitle2" gutterBottom>
              PINNED
            </Typography>
            <Masonry columns={{xs: 1, md: 2, lg: 3}} spacing={2}>
              {pinned}
            </Masonry>
          </div>
      }
      
      {
        // CHECK IF THERE ARE UNPINNED NOTES
        unPinned.length > 0 &&
          <div>
            {pinned.length > 0 ? <Typography variant="subtitle2" gutterBottom>OTHERS</Typography> : ''}
            
            <Masonry columns={{xs: 1, md: 2, lg: 3}} spacing={2}>
              {unPinned}
            </Masonry>
          </div>
      }
    </Container>
  )
}
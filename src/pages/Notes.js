/* eslint-disable react/prop-types */
import noteService from '../services/notes'

import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import NoteCard from '../components/NoteCard'
import Masonry from '@mui/lab/Masonry'
import Typography from '@mui/material/Typography'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export default function Notes({ allLabels, labelToView }) {
  const [notes, setNotes] = useState([])

  const [snackBarMsg, setSnackBarMsg] = useState('')
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  // Returns all notes of a specific label
  const filterNotesByLabel = (label, notesToFilter) => {
    return notesToFilter.filter(note =>
      note.labels.some(noteLabel => noteLabel === label.id)
    )
  }
  
  useEffect(() => {
    // Fetch Notes
    noteService
      .getAll()
      .then(notes => {
        if(labelToView === '') {
          // Display all notes
          setNotes(notes)
        }
        else {
          // Filter notes based on the labelToView
          const filteredNotes = filterNotesByLabel(labelToView, notes)
          setNotes(filteredNotes)
        }
      })
      .catch(error => {
        // Network Error message
        console.log(error)
      })
  }, [labelToView])

  // Handle closing snackbar
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackBarOpen(false)
  }

  const showSnackBar = (message) => {
    setSnackBarMsg(message)
    setSnackBarOpen(true)
  }

  // Handle deleting of note
  const handleDelete = async (id) => {
    noteService
      .remove(id)
      .then(() => {
        const newNotes = notes.filter(note => note.id !== id)
        setNotes(newNotes)
        showSnackBar('Successfully deleted note!')
      })
      .catch(error => {
        console.log(error)
        showSnackBar('Failed to delete note.')
      })
  }

  // Update labels of a specific note
  const updateLabels = async (note, labels) => {
    const updatedNote = {
      ...note,
      'labels': labels
    }

    noteService
      .update(note.id, updatedNote)
      .then(() => {
        console.log('Labels updated successfully')
        // Update state with note
        let newNotes = notes.map((n) => (n.id === note.id ? updatedNote : n))
        if(labelToView !== '') {
          newNotes = filterNotesByLabel(labelToView, newNotes)
        }
        setNotes(newNotes)
        showSnackBar('Successfully updated labels!')
      })
      .catch(error => {
        console.error(error)
        showSnackBar('Failed change labels.')
      })
  }

  // Toggles pin status of a note
  const togglePin = async (note) => {
    const updatedNote = {
      ...note,
      'pinned': !note.pinned
    }

    noteService
      .update(note.id, updatedNote)
      .then(() => {
        // Update state with note
        console.log('Note Pinned status updated')
        const newNotes = notes.map((n) => (n.id === note.id ? updatedNote : n))
        setNotes(newNotes)
        if (note.pinned) {showSnackBar('Successfully unpinned note.')}
        else {showSnackBar('Successfully pinned note.')}
      })
      .catch(error => {
        console.error(error)
        if (note.pinned) {showSnackBar('Failed to unpin note.')}
        else {showSnackBar('Failed to pin note.')}
        
      })
  }

  // Snackbar action
  const snackAction = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleSnackClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  // Pinned Notes
  const pinned = notes.filter(note => note.pinned).map(note => (
    <div key={note.id}>
      <NoteCard 
        note={note} 
        updateLabels={updateLabels} 
        allLabels={allLabels} 
        handleDelete={handleDelete} 
        togglePin={togglePin}
      />
    </div>
  ))

  // Unpinned notes
  const unPinned = notes.filter(note => !note.pinned).map(note => (
    <div key={note.id}>
      <NoteCard 
        note={note} 
        updateLabels={updateLabels} 
        allLabels={allLabels} 
        handleDelete={handleDelete} 
        togglePin={togglePin} 
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
        pinned.length > 0 ?
          <div>
            <Typography variant="subtitle2" gutterBottom>
              PINNED
            </Typography>
            <Masonry columns={{xs: 1, md: 2, lg: 3}} spacing={2}>
              {pinned}
            </Masonry>
          </div>
          :
          ''
      }
      
      {
        // CHECK IF THERE ARE UNPINNED NOTES
        unPinned.length > 0 ?
          <div>
            {pinned.length > 0 ? <Typography variant="subtitle2" gutterBottom>OTHERS</Typography> : ''}
            
            <Masonry columns={{xs: 1, md: 2, lg: 3}} spacing={2}>
              {unPinned}
            </Masonry>
          </div>
          :
          ''
      }

      <Snackbar
        open={snackBarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackClose}
        message={snackBarMsg}
        action={snackAction}
      />
    </Container>
  )
}
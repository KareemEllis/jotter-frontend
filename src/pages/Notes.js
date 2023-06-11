import noteService from '../services/notes'

import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import NoteCard from '../components/NoteCard'
import Masonry from '@mui/lab/Masonry'
import Typography from '@mui/material/Typography'

export default function Notes({ allLabels, labelToView }) {
  const [notes, setNotes] = useState([]);

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
        if(labelToView === "") {
          // Display all notes
          setNotes(notes)
        }
        else {
          // Filter notes based on the labelToView
          const filteredNotes = filterNotesByLabel(labelToView, notes)
          setNotes(filteredNotes);
        }
      })
      .catch(error => {
        // Network Error message
        console.log(error)
      })
  }, [labelToView])

  const handleDelete = async (id) => {
    noteService
      .remove(id)
      .then(data => {
        const newNotes = notes.filter(note => note.id !== id)
        setNotes(newNotes)
      })
      //SETUP API TO SEND A POSITIVE REPSONSE IF NOTE DOES NOT EXIST
      .catch(error => console.log(error))
  }

  const updateLabels = async (note, labels) => {
    const updatedNote = {
      ...note,
      "labels": labels
    }

    noteService
      .update(note.id, updatedNote)
      .then(data => {
        console.log('Labels updated successfully')
        // Update state with note
        let newNotes = notes.map((n) => (n.id === note.id ? updatedNote : n))
        if(labelToView !== "") {
          newNotes = filterNotesByLabel(labelToView, newNotes)
        }
        setNotes(newNotes);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const togglePin = async (note) => {
    const updatedNote = {
      ...note,
      "pinned": !note.pinned
    }

    noteService
      .update(note.id, updatedNote)
      .then(data => {
        console.log(data)
        console.log('Note Pinned status updated')
        // Update state with note
        const newNotes = notes.map((n) => (n.id === note.id ? updatedNote : n))
        setNotes(newNotes)
      })
      .catch(error => {
        console.error(error)
      })
  }


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
        {labelToView === "" ? "My Notes" : labelToView.name}
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
        ""
      }
      
      {
        // CHECK IF THERE ARE UNPINNED NOTES
        unPinned.length > 0 ?
        <div>
          {pinned.length > 0 ? <Typography variant="subtitle2" gutterBottom>OTHERS</Typography> : ""}
          
          <Masonry columns={{xs: 1, md: 2, lg: 3}} spacing={2}>
            {unPinned}
          </Masonry>
        </div>
        :
        ""
      }
    </Container>
  )
}
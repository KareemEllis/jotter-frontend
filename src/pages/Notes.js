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
        if(labelToView == "") {
          setNotes(notes)
        }
        else {
          // Filter notes based on the labelToView
          const filteredNotes = filterNotesByLabel(labelToView, notes)
          setNotes(filteredNotes);
        }
      })
  }, [labelToView])


  const handleDelete = async (id) => {
    await fetch('http://localhost:8000/notes/' + id, {
      method: 'DELETE'
    })
    const newNotes = notes.filter(note => note.id != id)
    setNotes(newNotes)
  }

  const updateLabels = async (note, labels) => {
    const updatedNote = {
      ...note,
      "labels": labels
    }

    await fetch('http://localhost:8000/notes/' + note.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedNote)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update labels');
      }
      // Handle success
      console.log('Labels updated successfully');
      // Update state with note
      let newNotes = notes.map((n) => (n.id === note.id ? updatedNote : n))
      if(labelToView != "") {
        newNotes = filterNotesByLabel(labelToView, newNotes)
      }
      setNotes(newNotes);

    })
    .catch(error => {
      // Handle error
      console.error(error);
    });
  }

  const togglePin = async (note) => {
    const updatedNote = {
      ...note,
      "pinned": !note.pinned
    }

    await fetch('http://localhost:8000/notes/' + note.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedNote)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update document');
      }
      // Handle success
      console.log('Document updated successfully');
      // Update state with note
      const newNotes = notes.map((n) => (n.id === note.id ? updatedNote : n));
      setNotes(newNotes);

    })
    .catch(error => {
      // Handle error
      console.log("ERROR")
      console.error(error);
    });
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
        {labelToView == "" ? "My Notes" : labelToView.name}
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
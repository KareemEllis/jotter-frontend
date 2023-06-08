import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export default function EditLabels({ allLabels, setAllLabels }) {
  const [newLabel, setNewLabel] = useState('')
  const [newLabelError, setNewLabelError] = useState(false)
  const [labelNameHelperText, setLabelNameHelperText] = useState('')

  const [allLabelErrors, setAllLabelErrors] = useState([])
  const [allHelperTexts, setAllHelperTexts] = useState([])

  //Set up error and helper text states for labels to be edited
  useEffect(() => {
    if (allLabels.length > 0) {
      setAllLabelErrors(
        allLabels.map(label => {
          return {
            id: label.id,
            error: false
          };
        })
      );
      setAllHelperTexts(
        allLabels.map(label => {
          return {
            id: label.id,
            text: ""
          };
        })
      );
    }
  }, [allLabels]);

  //Submit event for creating a new label
  const handleSubmit = (e) => {
    e.preventDefault()
    setNewLabelError(false)
    setLabelNameHelperText('')

    const labelAlreadyExists = allLabels.some(l => l.name === newLabel)

    if (newLabel == '') {
      setNewLabelError(true)
      setLabelNameHelperText('Field cannot be left blank.')
    }
    if (labelAlreadyExists) {
      setNewLabelError(true)
      setLabelNameHelperText('This label already exists.')
    }

    if (newLabel != '' && !labelAlreadyExists) {
      fetch('http://localhost:8000/labels', {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({ "name": newLabel })
      })
      .then(() => {
        //ADD CODE TO UPDATE STATE WITH RETURNED JSON
        setNewLabel('')
      })
    } 
  }

  //Delete label
  const handleDelete = (e, label) => {
    console.log(`Deleting label ${label.name}`)

    fetch('http://localhost:8000/notes')
      .then(res => res.json())
      .then(async data => {
        const notesToEdit = data.filter(note =>
          note.labels.some(noteLabel => noteLabel === label.id)
        )

        const editedNotes = notesToEdit.map(note => {
          return {
            ...note,
            labels: note.labels.filter(l => l != label.id)
          }
        })

        fetch('http://localhost:8000/notes', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedNotes)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to Remove Label from notes');
            }
            // Handle success
            console.log('Removed Label from notes Sucessfully');
          })
          .catch(error => {
            // Handle error
            console.error(error);
          });

        await fetch('http://localhost:8000/labels/' + label.id, {
          method: 'DELETE'
        })
        const newLabels = allLabels.filter(l => l.id != label.id)
        setAllLabels(newLabels)
      })
  }

  //Event handler for editing a label
  const handleLabelNameChange = async (newText, label) => {
    //Change the error state for edited label
    const changeErrorState = (bool) => {
      const errors = allLabelErrors.map(labelError => {
        if (labelError.id == label.id) {
          return {
            id: label.id,
            error: bool
          }
        }
        else {
          return labelError
        }
      })
      setAllLabelErrors(errors)
    } 
    //Change the helper text for the edited label
    const changeHelperText = (text) => {
      const texts = allHelperTexts.map(helperText => {
        if(helperText.id == label.id) {
          return {
            id: label.id,
            text: text
          }
        }
        else {
          return helperText
        }
      })
      setAllHelperTexts(texts)
    }

    const labelAlreadyExists = allLabels.some(l => l.name === newText) && newText != label.name
    changeErrorState(false)
    changeHelperText("")

    //Check if label is empty
    if(newText == '') {
      console.log("Cannot be empty")
      changeErrorState(true)
      changeHelperText("Field cannot be left blank.")
    }

    //Check if label already exists
    if(labelAlreadyExists) {
      console.log("Already Exists")
      changeErrorState(true)
      changeHelperText("This label already exists.")
    }
  }

  const handleBlur = (newText, label) => {
    const labelAlreadyExists = allLabels.some(l => l.name === newText) && newText != label.name

    if(newText != "" && !labelAlreadyExists) {
      const editedLabel = {...label, name: newText}

      fetch('http://localhost:8000/labels/' + label.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedLabel)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to edit Label');
          }
          // Handle success
          console.log('Label edited successfully');
          // Update state with note
          let newLabels = allLabels.map((l) => (l.id === label.id ? editedLabel : l))
          setAllLabels(newLabels);
    
        })
        .catch(error => {
          // Handle error
          console.error(error);
        });
    }
  }

  return (
    <Container size="sm">
      <Typography
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Create New Labels
      </Typography>

      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          onChange={(e) => setNewLabel(e.target.value)}
          label="New Label" 
          variant="outlined" 
          color="secondary" 
          fullWidth
          sx={{ maxWidth: '500px', display: 'block' }}
          error={newLabelError}
          helperText={labelNameHelperText}
          margin="normal"
        />

        <Button
        type="submit" 
        color="secondary" 
        variant="contained"
        endIcon={<KeyboardArrowRightIcon />}
        margin="normal"
        >
          Create
        </Button>
      </form>

      <Typography
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
        sx={{ marginTop: '15px' }}
      >
        Edit Labels
      </Typography>
      {
        allLabels.map(label => {
          //Get the error state for current label
          const labelError = allLabelErrors.find(item => item.id == label.id)
          //Get helper text state for current label
          const helperText = allHelperTexts.find(item => item.id == label.id)

          return (
            <Container 
              key={label.name}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Tooltip title="Delete Label">
                <IconButton
                  onClick={(e) =>handleDelete(e, label)}
                  color='secondary'
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            
              <TextField
                onChange={(e) => handleLabelNameChange(e.target.value.trim(), label)}
                onBlur={(e) => handleBlur(e.target.value.trim(), label)}
                defaultValue={label.name}
                placeholder="Label Name" 
                variant="outlined" 
                color="secondary" 
                fullWidth
                sx={{ maxWidth: '500px' }}
                error={labelError ? labelError.error : false}
                helperText={helperText ? helperText.text : ""}
                margin="normal"
              />
            </Container>
          )
          
        })
      }
    </Container>
  )
}
import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import { openSnackBar } from '../reducers/snackBarReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [loading, setLoading] = useState(false)

  if(user) {
    console.log('User already logged in. Redirecting to home page')
    navigate('/')
  }
  const [firstNameHelper, setFirstNameHelper] = useState('')
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameHelper, setLastNameHelper] = useState('')
  const [lastNameError, setLastNameError] = useState(false)

  const [usernameHelper, setUsernameHelper] = useState('')
  const [usernameError, setUsernameError] = useState(false)
  const [passwordHelper, setPasswordHelper] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const changeFirstNameError = (message, bool) => {
    setFirstNameHelper(message)
    setFirstNameError(bool)
  }
  const changeLastNameError = (message, bool) => {
    setLastNameHelper(message)
    setLastNameError(bool)
  }
  const changeUsernameError = (message, bool) => {
    setUsernameHelper(message)
    setUsernameError(bool)
  }
  const changePasswordError = (message, bool) => {
    setPasswordHelper(message)
    setPasswordError(bool)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    changeFirstNameError('', false)
    changeLastNameError('', false)
    changeUsernameError('', false)
    changePasswordError('', false)

    const data = new FormData(event.currentTarget)
    const firstName = data.get('firstName')
    const lastName = data.get('lastName')
    const username = data.get('username')
    const password = data.get('password')

    if(firstName.trim() == '') {
      changeFirstNameError('Field cannot be empty.', true)
    } else if(firstName.includes(' ')) {
      changeFirstNameError('Field cannot have a space.', true)
    }

    if(lastName.trim() == '') {
      changeLastNameError('Field cannot be empty.', true)
    } else if(lastName.includes(' ')) {
      changeLastNameError('Field cannot have a space.', true)
    }

    if(username.trim() == '') {
      changeUsernameError('Field cannot be empty.', true)
    } else if(lastName.includes(' ')) {
      changeUsernameError('Field cannot have a space.', true)
    }

    if(password.trim() == '') {
      changePasswordError('Field cannot be empty.', true)
    } else if(password.includes(' ')) {
      changePasswordError('Field cannot have a space.', true)
    }

    if(!firstNameError && !lastNameError && !usernameError && !passwordError) {
      setLoading(true)
      //Create user
      await userService.create(`${firstName} ${lastName}`, username, password)
        .then(() => {
          setLoading(false)
          navigate('/login')
        })
        .catch(error => {
          setLoading(false)
          dispatch(openSnackBar('Failed to register.'))
          console.log(error)
          if (error.message == 'username not unique') {
            changeUsernameError('Username already exists.', true)
          }
        })
    }

  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name='firstName'
                required
                fullWidth
                label="First Name"
                autoFocus
                error={firstNameError}
                helperText={firstNameHelper}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name='lastName'
                required
                fullWidth
                label="Last Name"
                error={lastNameError}
                helperText={lastNameHelper}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='username'
                required
                fullWidth
                label="Username"
                error={usernameError}
                helperText={usernameHelper}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='password'
                required
                fullWidth
                label="Password"
                type="password"
                error={passwordError}
                helperText={passwordHelper}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress color="inherit" size={20} /> : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
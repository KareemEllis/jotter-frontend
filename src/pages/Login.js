import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import { openSnackBar } from '../reducers/snackBarReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../reducers/userReducer'

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

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [loading, setLoading] = useState(false)

  if(user) {
    console.log('User already logged in. Redirecting to home page')
    navigate('/')
  }

  const [alertActive, setAlertActive] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameHelper, setUsernameHelper] = useState('')
  const [usernameError, setUsernameError] = useState(false)
  const [passwordHelper, setPasswordHelper] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setUsernameError(false)
    setPasswordError(false)
    setUsernameHelper('')
    setPasswordHelper('')

    if(username == '') {
      setUsernameError(true)
      setUsernameHelper('Field cannot be empty.')
    }
    if(password == '') {
      setPasswordError(true)
      setPasswordHelper('Field cannot be empty.')
    }

    if(username && password){
      try {
        setLoading(true)
        console.log('Dispatching login action')
        await dispatch(loginUser(username, password))
        console.log('Should be navigating to Home page after login')
        setLoading(false)
        navigate('/')
      } 
      catch (error) {
        setLoading(false)
        dispatch(openSnackBar('Failed to log in.'))
        console.log(error)
        if(error.message == 401) {
          setAlertActive(true)
        }
      }
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
            Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            error={usernameError}
            helperText={usernameHelper}
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            error={passwordError}
            helperText={passwordHelper}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress color="inherit" size={20} /> : 'Sign In'}
          </Button>
          {
            alertActive &&
            <Alert severity="error" sx={{ mb: 2 }}>
              Incorrect username or password.
            </Alert>
          }
          
          <Link 
            component="button"
            variant="body2"
            onClick={() => navigate('/register')}
          >
            {'Don\'t have an account? Sign Up'}
          </Link>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}
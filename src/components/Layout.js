/* eslint-disable react/prop-types */
/* global process */
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { AddCircleOutlineOutlined, SubjectOutlined } from '@mui/icons-material/'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LabelIcon from '@mui/icons-material/Label'
import EditIcon from '@mui/icons-material/Edit'
import AppBar from '@mui/material/AppBar'

import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'

export default function Layout({ children, userLoaded }) {
  const drawerWidth = 240
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const activeStyle = {
    background: '#f4f4f4'
  }
  const user = useSelector(state => state.user)
  
  useEffect(() => {
    if(!user && userLoaded) {
      console.log('User not logged in')
      console.log('Should redirect to login page')
      navigate('/login')
    }
  }, [user, userLoaded])

  const [mobileOpen, setMobileOpen] = useState(false)

  const labels = useSelector(state => state.labels)

  const items = [
    { 
      id: 'My Notes',
      text: 'My Notes', 
      icon: <SubjectOutlined color='secondary'/>, 
      path: '/' 
    },
    { 
      id: 'Create Note', 
      text: 'Create Note', 
      icon: <AddCircleOutlineOutlined color='secondary'/>, 
      path: '/create' 
    },
    { 
      id: 'Edit Labels', 
      text: 'Edit Labels', 
      icon: <EditIcon color='secondary'/>, 
      path: '/labels' 
    }
  ]
  const labelMenuItems = labels.map(label => ({
    id: label.id,
    text: label.name,
    icon: <LabelIcon color='secondary'/>,
    path: `/label/${label.id}`
  }))
  const menuItems = [...items, ...labelMenuItems]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const drawer = (
    <div>
      <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
        <img style={{ width: '50%', alignSelf: 'center' }} src={`${process.env.PUBLIC_URL}/jotter-logo.png`} alt="Logo" />
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.id} 
            disablePadding
            onClick={() => navigate(item.path)}
            style={location.pathname === item.path ? activeStyle : null}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem 
          key='Logout' 
          disablePadding
          onClick={() => handleLogout()}
        >
          <ListItemButton>
            <ListItemIcon>
              <LogoutOutlinedIcon color='error'/>
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }} >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {user && user.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          anchor="left"
          //container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, background: '#f9f9f9', width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        { children }
      </Box>
    </Box>
  )
}
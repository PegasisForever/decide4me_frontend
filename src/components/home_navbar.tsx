import React, {useState} from 'react'
import {Box, createStyles, makeStyles, Theme} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import {getFBAuth} from '../auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {LoginWindow} from '../pages/login_window'
import {Window} from './window'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      height: '56px',
      borderBottom: '2px solid black',
      zIndex: 1000,
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
)

export function HomeNavbar() {
  const [user] = useAuthState(getFBAuth())
  // if(user) user.getIdToken(true).then(console.log)
  const [showLogin, setShowLogin] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const classes = useStyles()
  return <Box className={classes.bar}>
    Decide4me
    {user ? <img onClick={() => setShowLogout(!showLogout)} src={user.photoURL || ''}/> :
      <Button variant="outlined" onClick={() => setShowLogin(true)}>Login</Button>}
    {(showLogin && !user) ? <LoginWindow onClose={() => setShowLogin(false)}/> : null}
    {(showLogout && user) ? <LogoutOverlay onClose={() => setShowLogout(false)}/> : null}
  </Box>
}

const useLogoutWindowStyles = makeStyles((theme: Theme) =>
  createStyles({
    windowContainer: {
      zIndex: 2001,
      position:'fixed',
      border: '2px solid black',
      backgroundColor: 'white',
      right: '4px',
      top: '64px',
      width: '128px'
    },
  }),
)


function LogoutOverlay({onClose}: { onClose: () => void }) {
  const classes = useLogoutWindowStyles()
  return <Window onClick={onClose} backgroundColor={'transparent'}>
    <Box className={classes.windowContainer}>
      <Button variant="outlined" onClick={() => getFBAuth().signOut().then(onClose)}>Logout</Button>
    </Box>
  </Window>
}

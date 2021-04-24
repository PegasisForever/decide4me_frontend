import React, {useState} from 'react'
import {Box, createStyles, makeStyles, Paper, Theme, Typography} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import {getFBAuth} from '../auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {Window} from './window'
import {useHistory} from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      height: '56px',
      boxShadow: '0 0 0.2rem rgb(0 0 0 / 10%), 0 0.2rem 0.4rem rgb(0 0 0 / 20%)',
      zIndex: 1000,
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    loginButton: {
      marginRight: '16px',
    },
    logoText: {
      fontSize: '1.7rem',
      marginLeft: '16px',
    },
    profilePicture: {
      marginRight: '8px',
      height: '42px',
      borderRadius:'50%'
    },
  }),
)

export function HomeNavbar() {
  const history = useHistory()
  const [user] = useAuthState(getFBAuth())
  const [showLogout, setShowLogout] = useState(false)
  const classes = useStyles()
  return <Box className={classes.bar}>
    <Typography className={classes.logoText}>Decide4me</Typography>
    {user ? <img className={classes.profilePicture} alt={'profile'} onClick={() => setShowLogout(!showLogout)}
                 src={user.photoURL || ''}/> :
      <Button className={classes.loginButton} onClick={() => history.push('/login')}>Login</Button>}
    {(showLogout && user) ? <LogoutOverlay onClose={() => setShowLogout(false)}/> : null}
  </Box>
}

const useLogoutWindowStyles = makeStyles((theme: Theme) =>
  createStyles({
    windowContainer: {
      zIndex: 2001,
      position: 'fixed',
      backgroundColor: 'white',
      right: '4px',
      top: '64px',
      width: '128px',
    },
    button: {
      width: '100%',
    },
  }),
)


function LogoutOverlay({onClose}: { onClose: () => void }) {
  const classes = useLogoutWindowStyles()
  return <Window onClick={onClose} backgroundColor={'transparent'}>
    <Paper elevation={2} className={classes.windowContainer}>
      <Button className={classes.button} onClick={() => getFBAuth().signOut().then(onClose)}>Logout</Button>
    </Paper>
  </Window>
}

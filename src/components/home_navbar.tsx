import React, {useState} from 'react'
import {Box, createStyles, makeStyles, Theme} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import {getFBAuth} from '../auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {LoginWindow} from '../pages/login_window'

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
  const [showLogin, setShowLogin] = useState(false)
  const classes = useStyles()
  return <Box className={classes.bar}>
    Decide4me
    {user ? <img src={user.photoURL || ''}/> :
      <Button variant="outlined" onClick={() => setShowLogin(true)}>Login</Button>}
    {(showLogin && !user) ? <LoginWindow onClose={() => setShowLogin(false)}/> : null}
  </Box>
}

import {NormalWindowContainer, Window, WindowContainerTitle} from '../components/window'
import React from 'react'
import {getFBAuth} from '../auth'
import {StyledFirebaseAuth} from 'react-firebaseui'
import firebase from 'firebase/app'
import {network} from '../network/network'
import {useHistory} from 'react-router-dom'
import {useAuthState} from 'react-firebase-hooks/auth'
import {createStyles, makeStyles, Theme} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginDiv: {
      marginTop: '48px',
    },
  }),
)

export function LoginWindow() {
  const classes = useStyles()
  const history = useHistory()
  const [user] = useAuthState(getFBAuth())
  const onClose = () => {
    history.replace('/')
  }

  if (user) onClose()

  return <Window onClick={onClose} center>
    <NormalWindowContainer height={'300px'}>
      <WindowContainerTitle title={'Login'} onClose={onClose}/>
      <StyledFirebaseAuth className={classes.loginDiv} uiConfig={{
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            console.log('success', authResult, redirectUrl)
            network.register(authResult.user)
            return true
          },
          signInFailure: function (e) {
            console.error(e)
          },
        },
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
        ],
      }} firebaseAuth={getFBAuth()}/>
    </NormalWindowContainer>
  </Window>
}

import {NormalWindowContainer, Window} from '../components/window'
import React from 'react'
import {Box} from '@material-ui/core'
import {getFBAuth} from '../auth'
import {StyledFirebaseAuth} from 'react-firebaseui'
import firebase from 'firebase/app'
import {network} from '../network/network'
import {useHistory} from 'react-router-dom'
import {useAuthState} from 'react-firebase-hooks/auth'

export function LoginWindow() {
  const history = useHistory()
  const [user] = useAuthState(getFBAuth())
  const onClose = () => {
    history.replace('/')
  }

  if (user) onClose()

  return <Window onClick={onClose} center>
    <NormalWindowContainer>
      <Box display={'flex'} justifyContent={'space-between'}>
        <h3>Login</h3>
        <span onClick={onClose}>X</span>
      </Box>
      <StyledFirebaseAuth uiConfig={{
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

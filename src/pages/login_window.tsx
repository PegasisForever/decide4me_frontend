import {NormalWindowContainer, Window} from '../components/window'
import React from 'react'
import {Box} from '@material-ui/core'
import {getFBAuth} from '../auth'
import {StyledFirebaseAuth} from 'react-firebaseui'
import firebase from 'firebase/app'

export function LoginWindow({onClose}: { onClose: () => void }) {
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
            onClose()
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

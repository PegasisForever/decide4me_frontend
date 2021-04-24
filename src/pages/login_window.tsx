import {NormalWindowContainer, Window, WindowContainerTitle} from '../components/window'
import React, {useEffect} from 'react'
import {getFBAuth} from '../auth'
import {StyledFirebaseAuth} from 'react-firebaseui'
import firebase from 'firebase/app'
import {network} from '../network/network'
import {useHistory, useLocation} from 'react-router-dom'
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
  let location = useLocation()
  const [user] = useAuthState(getFBAuth())

  let from = '/'
  let title = 'Login'
  if (location.state) {
    from = (location.state as any).from || '/'
    title = (location.state as any).title || 'Login'
  }

  console.log(from)
  const onCancel = () => history.replace('/')
  const onSuccess = () => history.replace(from)

  useEffect(() => {
    if (user) onSuccess()
  }, [])

  return <Window onClick={onCancel} center>
    <NormalWindowContainer height={'300px'}>
      <WindowContainerTitle title={title} onClose={onCancel}/>
      <StyledFirebaseAuth className={classes.loginDiv} uiConfig={{
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            console.log('success', authResult, redirectUrl)
            network.register(authResult.user)
            onSuccess()
            return false
          },
          signInFailure: (e) => {
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

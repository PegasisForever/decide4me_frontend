import {Redirect, Route} from 'react-router-dom'
import firebase from 'firebase/app'

const firebaseConfig ={
  apiKey: 'AIzaSyD6nKZYaW0ReZBVO0zY7_7HGwGuUnzIzCg',
  authDomain: 'decide4me-pegasis.firebaseapp.com',
  projectId: 'decide4me-pegasis',
  storageBucket: 'decide4me-pegasis.appspot.com',
  messagingSenderId: '308309416411',
  appId: '1:308309416411:web:2d1965fc9be62076a2affe',
  measurementId: 'G-SGR5498494',
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

export function getFBAuth() {
  return firebase.auth()
}

// @ts-ignore
export function PrivateRoute({children, ...rest}) {
  let auth = getFBAuth()
  return <Route
    {...rest}
    render={({location}) =>
      auth.currentUser ? children :
        <Redirect
          to={{
            pathname: '/login',
            state: {from: location},
          }}
        />
    }
  />
}

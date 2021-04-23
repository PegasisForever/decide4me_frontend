import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

firebase.initializeApp({
  apiKey: 'AIzaSyD6nKZYaW0ReZBVO0zY7_7HGwGuUnzIzCg',
  authDomain: 'decide4me-pegasis.firebaseapp.com',
  projectId: 'decide4me-pegasis',
  storageBucket: 'decide4me-pegasis.appspot.com',
  messagingSenderId: '308309416411',
  appId: '1:308309416411:web:2d1965fc9be62076a2affe',
  measurementId: 'G-SGR5498494',
})

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root'),
)

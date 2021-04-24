import React from 'react'
import {HomePage} from './pages/home_page'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import {NewPostWindow} from './pages/new_post_window'
import {LoginWindow} from './pages/login_window'

function App() {
  return (
    <Router>
      <HomePage/>
      <Switch>
        <Route path='/new_post'>
          <NewPostWindow/>
        </Route>
        <Route path='/login'>
          <LoginWindow/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App

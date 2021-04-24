import React from 'react'
import {HomePage} from './pages/home_page'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {NewPostWindow} from './pages/new_post_window'
import {LoginWindow} from './pages/login_window'
import {createStyles, makeStyles, Theme} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      'body': {
        margin: '0',
      },
    },
  }),
)

function App() {
  useStyles()
  return (
    <Router>
      <HomePage/>
      <Switch>
        <Route path="/new_post">
          <NewPostWindow/>
        </Route>
        <Route path="/login">
          <LoginWindow/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App

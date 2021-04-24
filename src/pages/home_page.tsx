import {HomeNavbar} from '../components/home_navbar'
import {Box, createStyles, Fab, makeStyles, Theme} from '@material-ui/core'
import React from 'react'
import {Post} from '../model/post'
import CreateIcon from '@material-ui/icons/Create'
import {useHistory} from 'react-router-dom'
import usePromise from 'react-use-promise'
import {PostComponent} from '../components/post_component'
import {useAuthState} from 'react-firebase-hooks/auth'
import {getFBAuth} from '../auth'

export function HomePage() {
  const [user] = useAuthState(getFBAuth())
  const [post] = usePromise(() => Post.getFromID('NCvcO7YgEu1UT52GbrUy'), [])

  return <div>
    <HomeNavbar/>
    {user ? <Box marginTop={'68px'}>
      {post ? <PostComponent post={post}/> : null}
    </Box> : null}
    <NewPostButton/>
  </div>
}

const useNewPostButtonStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    icon: {
      marginRight: theme.spacing(1),
    },
  }),
)

function NewPostButton() {
  const classes = useNewPostButtonStyles()
  const history = useHistory()

  return <Fab variant="extended" className={classes.fab} onClick={() => history.push('/new_post')}>
    <CreateIcon className={classes.icon}/>
    Decide for me
  </Fab>
}

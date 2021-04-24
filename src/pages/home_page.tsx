import {HomeNavbar} from '../components/home_navbar'
import {Box, createStyles, Fab, makeStyles, Theme} from '@material-ui/core'
import React from 'react'
import {Post} from '../model/post'
import CreateIcon from '@material-ui/icons/Create'
import {useHistory} from 'react-router-dom'
import usePromise from 'react-use-promise'
import {PostComponent} from '../components/post_component'

export function HomePage() {
  const [post] = usePromise(() => Post.getFromID('NCvcO7YgEu1UT52GbrUy'), [])

  return <div>
    <HomeNavbar/>
    <Box marginTop={'68px'}>
      {post ? <PostComponent post={post}/> : null}
    </Box>
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

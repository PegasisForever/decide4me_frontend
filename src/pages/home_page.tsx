import {HomeNavbar} from '../components/home_navbar'
import {Box, createStyles, Fab, makeStyles, Theme} from '@material-ui/core'
import React from 'react'
import CreateIcon from '@material-ui/icons/Create'
import {useHistory} from 'react-router-dom'
import usePromise from 'react-use-promise'
import {PostComponent} from '../components/post_component'
import {network} from '../network/network'
import {useAuthState} from 'react-firebase-hooks/auth'
import {getFBAuth} from '../auth'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    postList: {
      marginTop: '68px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }),
)

export function HomePage() {
  const [, isLoading] = useAuthState(getFBAuth())

  return <div>
    <HomeNavbar/>
    {!isLoading ? <PostsList/> : null}
    <NewPostButton/>
  </div>
}

function PostsList() {
  const classes = useStyles()
  const [recommendationList] = usePromise(() => network.getRecommendation(), [])
  return <Box className={classes.postList} marginTop={'68px'}>
    {recommendationList?.map(({post, user}) => <PostComponent key={post.id} post={post} user={user}/>)}
  </Box>
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

  return <Fab variant="extended" className={classes.fab} color="primary" onClick={() => history.push('/new_post')}>
    <CreateIcon className={classes.icon}/>
    Decide for me
  </Fab>
}

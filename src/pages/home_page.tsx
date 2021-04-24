import {HomeNavbar} from '../components/home_navbar'
import {Box, createStyles, Fab, makeStyles, Theme} from '@material-ui/core'
import {PostComponent} from '../components/post_component'
import React from 'react'
import {Post, TextPostData} from '../model/post'
import CreateIcon from '@material-ui/icons/Create'
import {useHistory} from 'react-router-dom'

const testPost = new Post(
  'user_id',
  'Title',
  'desc desc desc desc desc desc desc desc ',
  new Date(),
  55,
  10,
  new TextPostData(
    new Map<string, number>([['aaaaa', 1], ['bbbbbbbb', 2], ['cccccccccc', 3]]),
  ),
  null,
)

export function HomePage() {
  return <div>
    <HomeNavbar/>
    <Box marginTop={'68px'}>
      <PostComponent post={testPost}/>
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

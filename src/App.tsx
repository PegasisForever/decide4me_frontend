import React from 'react'
import {Post, TextPostData} from './model/post'
import {PostComponent} from './components/post_component'
import {HomeNavbar} from './components/home_navbar'
import {Box} from '@material-ui/core'

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

function App() {
  return (
    <div className="App">
      <HomeNavbar/>
      <Box marginTop={'68px'}>
        <PostComponent post={testPost}/>
      </Box>
    </div>
  )
}

export default App

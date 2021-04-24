import {Post} from '../model/post'
import React, {ReactNode} from 'react'
import {Box} from '@material-ui/core'

export function PostComponent({post}: { post: Post }) {
  return <Box border={'2px solid black'}>
    <h3>{post.title}</h3>
    <p>{post.time.toDateString()}</p>
    <p>{post.description}</p>
    {post.textData ? <TextPostPart post={post}/> : <ImagePostPart post={post}/>}
    <p>{post.views} views</p>
  </Box>
}

function TextPostPart({post}: { post: Post }) {
  const choiceLis: Array<ReactNode> = []
  post.textData!.choices.forEach((votes, choice) => {
    choiceLis.push(<li key={choice}>{choice}: {votes}</li>)
  })
  return <div>
    <ol>
      {choiceLis}
    </ol>
  </div>
}

function ImagePostPart({post}: { post: Post }) {
  return <div>
    image part
  </div>
}

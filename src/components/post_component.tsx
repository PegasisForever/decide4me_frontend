import {Post} from '../model/post'
import React, {Component, ReactNode} from 'react'
import {Box} from '@material-ui/core'
import {PropsWithVisible} from '../utils'
// @ts-ignore
import {withIsVisible} from 'react-is-visible'

class _PostComponent extends Component<PropsWithVisible<{ post: Post }>> {
  state = {
    post: this.props.post,
  }

  cancelRealTimeUpdateFn: null | (() => void) = null

  componentDidUpdate = () => {
    if (this.props.isVisible && !this.cancelRealTimeUpdateFn) {
      console.log(this.state.post.id, 'start update')
      this.cancelRealTimeUpdateFn = this.state.post.onUpdate((newPost) => {
        this.setState({
          post: newPost,
        })
      })
    } else if (!this.props.isVisible && this.cancelRealTimeUpdateFn) {
      console.log(this.state.post.id, 'stop update')
      this.cancelRealTimeUpdateFn()
      this.cancelRealTimeUpdateFn = null
    }
  }

  render = () => {
    let post = this.state.post
    return <Box border={'2px solid black'}>
      <h3>{post.title}</h3>
      <p>{post.time.toDateString()}</p>
      <p>{post.description}</p>
      {post.textData ? this.getTextPostPart() : this.getImagePostPart()}
    </Box>
  }

  getTextPostPart = () => {
    let post = this.state.post
    const choiceLis: Array<ReactNode> = []
    post.textData!.choices.forEach(({text, vote}) => {
      choiceLis.push(<li key={text}>{text}: {vote}</li>)
    })
    return <ol>
      {choiceLis}
    </ol>
  }

  getImagePostPart = () => {
    let post = this.state.post
    return <div>
      image part
    </div>
  }
}

export const PostComponent = withIsVisible(_PostComponent)

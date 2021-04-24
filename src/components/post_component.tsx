import {Post} from '../model/post'
import React, {Component, ReactNode} from 'react'
import {Box} from '@material-ui/core'
import {PropsWithVisible} from '../utils'
// @ts-ignore
import {withIsVisible} from 'react-is-visible'
import {getFBAuth} from '../auth'

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
    const myChoice = post.textData!.results.get(getFBAuth().currentUser!.uid)
    const choiceLis: Array<ReactNode> = []
    post.textData!.choices.forEach(({text, vote}, i) => {
      choiceLis.push(<li
        key={text}
        style={{backgroundColor: (myChoice === i) ? 'grey' : 'transparent'}}
        onClick={() => {
          if (i !== myChoice) {
            post.voteText(i)
            if (myChoice) post.textData!.choices[myChoice].vote--
            post.textData!.choices[i].vote++
            post.textData!.results.set(getFBAuth().currentUser!.uid, i)
            this.setState({})
          }
        }}>
        {text}: {vote}
      </li>)
    })
    return <ol>
      {choiceLis}
    </ol>
  }

  getImagePostPart = () => {
    // let post = this.state.post
    return <div>
      image part
    </div>
  }
}

export const PostComponent = withIsVisible(_PostComponent)

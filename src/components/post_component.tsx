import {Post} from '../model/post'
import React, {Component, ReactNode} from 'react'
import {Box} from '@material-ui/core'
import {PropsWithVisible} from '../utils'
// @ts-ignore
import {withIsVisible} from 'react-is-visible'
import {getFBAuth} from '../auth'
import firebase from 'firebase/app'
import {network} from '../network/network'

let storage = firebase.storage()

class _PostComponent extends Component<PropsWithVisible<{ post: Post }>> {
  state: {
    post: Post,
    imageDownloadUrl: string | null,
    imageWidth: number | null,
    imageHeight: number | null,
  } = {
    post: this.props.post,
    imageDownloadUrl: null,
    imageWidth: null,
    imageHeight: null,
  }

  cancelRealTimeUpdateFn: null | (() => void) = null

  componentDidMount = () => {
    if (this.state.post.imageData) {
      const pathReference = storage.ref(this.state.post.imageData.imageUrl)
      pathReference.getDownloadURL().then(url => this.setState({
        imageDownloadUrl: url,
      }))
    }
  }

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

  componentWillUnmount = () => {
    if (this.cancelRealTimeUpdateFn) {
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
    let fbUser = getFBAuth().currentUser
    const myChoice = post.textData!.results.get(fbUser?.uid || '')
    const choiceLis: Array<ReactNode> = []
    post.textData!.choices.forEach(({text, vote}, i) => {
      choiceLis.push(<li
        key={text}
        style={{backgroundColor: (myChoice === i) ? 'grey' : 'transparent'}}
        onClick={() => {
          if (i !== myChoice && fbUser) {
            post.voteText(i)
            if (myChoice) post.textData!.choices[myChoice].vote--
            post.textData!.choices[i].vote++
            post.textData!.results.set(fbUser.uid || '', i)
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
    const post = this.state.post
    const fbUser = getFBAuth().currentUser
    const dots: Array<ReactNode> = []
    post.imageData!.results.forEach(({x, y}, i) => {
      dots.push(<div
        key={i}
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          backgroundColor: 'white',
        }}/>)
    })
    return this.state.imageDownloadUrl ?
      <div style={{
        position: 'relative',
        aspectRatio: this.state.imageWidth ? `${this.state.imageWidth}/${this.state.imageHeight}` : undefined,
      }}>
        <img src={this.state.imageDownloadUrl}
             alt={'vote'}
             style={{width: '100%'}}
             onClick={e => {
               if (fbUser) {
                 // @ts-ignore
                 const rect = e.target.getBoundingClientRect()
                 const xPercent = (e.clientX - rect.left) / rect.width
                 const yPercent = (e.clientY - rect.top) / rect.height
                 network.voteImage(post.id, xPercent, yPercent)
                 post.imageData!.results.set(getFBAuth().currentUser!.uid, {x: xPercent, y: yPercent})
                 this.setState({})
               }
             }}
             onLoad={e => {
               this.setState({
                 // @ts-ignore
                 imageWidth: e.target.width,
                 // @ts-ignore
                 imageHeight: e.target.height,
               })
             }}/>
        {dots}
      </div> :
      <span>Loading</span>
  }
}

export const PostComponent = withIsVisible(_PostComponent)

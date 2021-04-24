import {Post} from '../model/post'
import React, {Component, ReactNode} from 'react'
import {Box, Paper, Typography, withStyles} from '@material-ui/core'
import {PropsWithClasses, PropsWithVisible} from '../utils'
// @ts-ignore
import {withIsVisible} from 'react-is-visible'
import {getFBAuth} from '../auth'
import firebase from 'firebase/app'
import {network} from '../network/network'

let storage = firebase.storage()

const styles = {
  imageVoteDot: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    backgroundColor: 'white',
  },
  card: {
    margin: '16px',
    width: '100%',
    maxWidth: '700px',
    overflowWrap: 'break-word',
  },
  textVoteList: {
    margin: '16px',
  },
  textVoteItem: {},
}

class _PostComponent extends Component<PropsWithClasses<PropsWithVisible<{ post: Post }>>> {
  state: {
    post: Post,
    imageDownloadUrl: string | null,
  } = {
    post: this.props.post,
    imageDownloadUrl: null,
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
    return <Paper className={this.props.classes.card} elevation={2}>
      <Typography>{post.title}</Typography>
      <Typography>{post.time.toDateString()}</Typography>
      <Typography>{post.description}</Typography>
      {post.textData ? this.getTextPostPart() : this.getImagePostPart()}
    </Paper>
  }

  getTextPostPart = () => {
    let post = this.state.post
    let fbUser = getFBAuth().currentUser
    const myChoice = post.textData!.results.get(fbUser?.uid || '')
    let totalVote = post.textData!.results.size
    const choiceLis: Array<ReactNode> = []
    post.textData!.choices.forEach(({text, vote}, i) => {
      let widthPercent = 0
      if (totalVote !== 0) {
        widthPercent = vote / totalVote
      }
      choiceLis.push(<Typography>
        <Box width={'100%'} height={'1.9rem'} margin={'4px 0'} position={'relative'}
             boxSizing={'border-box'}
             border={`2px solid ${(myChoice === i) ? '#3f51b5' : '#b3b7ff'}`} borderRadius="4px"
             className={this.props.classes.textVoteItem}
             key={i}
             onClick={() => {
               if (i !== myChoice && fbUser) {
                 post.voteText(i)
                 if (myChoice) post.textData!.choices[myChoice].vote--
                 post.textData!.choices[i].vote++
                 post.textData!.results.set(fbUser.uid || '', i)
                 this.setState({})
               }
             }}>
          {widthPercent !== 0 ? <Box position={'absolute'} left="-1px" top="-1px" bottom="-1px"
                                     width={`calc(${widthPercent * 100}% + 2px)`}
                                     borderRadius="4px"
                                     bgcolor={(myChoice === i) ? '#3f51b5' : '#b3b7ff'}/> : null}
          <Typography style={{position: 'absolute', color: (myChoice === i) ? 'white' : 'black', lineHeight: '1.8rem',paddingLeft:'4px'}}>
            {text}: {vote}
          </Typography>
        </Box>
      </Typography>)
    })
    return <div className={this.props.classes.textVoteList}>
      {choiceLis}
    </div>
  }

  getImagePostPart = () => {
    const post = this.state.post
    const fbUser = getFBAuth().currentUser
    const dots: Array<ReactNode> = []
    post.imageData!.results.forEach(({x, y}, i) => {
      dots.push(<div
        key={i}
        className={this.props.classes.imageVoteDot}
        style={{
          left: `${x * 100}%`,
          top: `${y * 100}%`,
        }}/>)
    })
    return this.state.imageDownloadUrl ?
      <div style={{
        position: 'relative',
        aspectRatio: `${post.imageData!.size.width}/${post.imageData!.size.height}`,
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
             }}/>
        {dots}
      </div> :
      <span>Loading</span>
  }
}

// @ts-ignore
export const PostComponent = withStyles(styles)(withIsVisible(_PostComponent))

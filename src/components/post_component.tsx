import {Post} from '../model/post'
import React, {Component, ReactNode} from 'react'
import {Box, CircularProgress, Paper, Typography, withStyles} from '@material-ui/core'
import {PropsWithClasses, PropsWithHistory, PropsWithVisible} from '../utils'
// @ts-ignore
import {withIsVisible} from 'react-is-visible'
import {getFBAuth} from '../auth'
import firebase from 'firebase/app'
import {network} from '../network/network'
import {User} from '../model/user'
import {withRouter} from 'react-router-dom'
import {motion} from 'framer-motion'

let storage = firebase.storage()

const styles = {
  imageVoteDot: {
    position: 'absolute',
    borderRadius: '50%',
    border: '2px solid black',
    width: '8px',
    height: '8px',
    backgroundColor: 'white',
    transform: 'translate(-50%,-50%)',
    pointerEvents: 'none',
  },
  card: {
    margin: '16px',
    width: 'calc(100% - 64px)',
    maxWidth: '700px',
    overflowWrap: 'break-word',
    padding: '16px',
  },
  textVoteList: {
    marginTop: '16px',
  },
  textVoteItem: {
    cursor: 'pointer',
    width: '100%',
    height: '1.9rem',
    margin: '4px 0',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '4px',
  },
  profileImage: {
    width: '48px',
    height: '48px',
    marginRight: '16px',
    borderRadius: '50%',
  },
  title: {
    fontSize: '1.5rem',
    marginTop: '16px',
  },
  description: {
    marginTop: '8px',
  },
  userName: {
    fontSize: '1rem',
  },
  timeText: {
    color: 'rgb(150,150,150)',
  },
  voteImage: {
    width: '100%',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  imageLoadPlaceHolder: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

class _PostComponent extends Component<PropsWithHistory<PropsWithClasses<PropsWithVisible<{ post: Post, user: User }>>>> {
  state: {
    post: Post,
    imageDownloadUrl: string | null,
    showImageHelp: boolean,
  } = {
    post: this.props.post,
    imageDownloadUrl: null,
    showImageHelp: false,
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
    const post = this.state.post
    const classes = this.props.classes
    return <Paper className={classes.card} elevation={2}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        {post.isAnonymous ?
          <Typography className={classes.userName}>Anonymous</Typography> :
          <Box display={'flex'} alignItems={'center'}>
            <img className={classes.profileImage} src={this.props.user.profileImageUrl} alt={'profile'}/>
            <Typography className={classes.userName}>{this.props.user.name}</Typography>
          </Box>}
        <Typography className={classes.timeText}>{this.localizeDate(post.time)}</Typography>
      </Box>

      <Typography className={classes.title}>{post.title}</Typography>
      {post.description !== '' ? <Typography className={classes.description}>{post.description}</Typography> : null}
      {post.textData ? this.getTextPostPart() : this.getImagePostPart()}
    </Paper>
  }

  localizeDate = (date: Date) => {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let hours = date.getHours().toString()
    let minutes = date.getMinutes().toString()
    return `${months[date.getMonth()]} ${date.getFullYear()}, ${hours.length === 1 ? ('0' + hours) : hours}:${minutes.length === 1 ? ('0' + minutes) : minutes}`
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
        <motion.div
          animate={{
            border: `2px solid ${(myChoice === i) ? '#3f51b5' : '#b3b7ff'}`,
          }}
          className={this.props.classes.textVoteItem}
          key={i}
          onClick={() => {
            if (i !== myChoice && fbUser) {
              post.voteText(i)
              if (myChoice) post.textData!.choices[myChoice].vote--
              post.textData!.choices[i].vote++
              post.textData!.results.set(fbUser.uid || '', i)
              this.setState({})
            } else if (!fbUser) {
              this.props.history.push('/login', {from: '/', title: 'Login to Vote'})
            }
          }}>
          <motion.div
            style={{
              position: 'absolute',
              left: '-2px',
              top: '-2px',
              bottom: '-2px',
              borderRadius: '4px',
            }}
            transition={{
              type: 'spring',
              bounce: 0,
            }}
            animate={{
              width: widthPercent === 0 ? '0px' : `calc(${widthPercent * 100}% + 4px)`,
              backgroundColor: (myChoice === i) ? '#3f51b5' : '#b3b7ff',
            }}
          />
          <Typography style={{
            position: 'absolute',
            lineHeight: '1.8rem',
            paddingLeft: '4px',
          }}>
            <motion.span
              animate={{
                color: (myChoice === i) ? '#FFF' : '#000',
              }}
              transition={{
                type: 'spring',
                bounce: 0,
              }}>
              {text}: {vote}
            </motion.span>
          </Typography>
        </motion.div>
      </Typography>)
    })
    return <div className={this.props.classes.textVoteList}>
      {choiceLis}
    </div>
  }

  getImagePostPart = () => {
    const classes = this.props.classes
    const post = this.state.post
    const fbUser = getFBAuth().currentUser
    const dots: Array<ReactNode> = []
    post.imageData!.results.forEach(({x, y}, userID) => {
      if (userID === fbUser?.uid) {
        dots.push(<div
          key={userID}
          style={{
            position: 'absolute',
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            width: '36px',
            height: '50.6px',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}>
          <img
            style={{position: 'absolute'}} src={'/pin.svg'} alt={'pin'} width="36px"
          />
          {fbUser.photoURL ? <img
            style={{
              position: 'absolute',
              borderRadius: '50%',
              top: '7.5px',
              left: '6px',
            }}
            src={fbUser.photoURL}
            alt={''}
            width="24px"
            height="24px"/> : null}
        </div>)
      } else {
        dots.push(<div
          key={userID}
          className={classes.imageVoteDot}
          style={{
            left: `${x * 100}%`,
            top: `${y * 100}%`,
          }}/>)
      }
    })
    return this.state.imageDownloadUrl ?
      <div style={{
        marginTop: '16px',
        position: 'relative',
        aspectRatio: `${post.imageData!.size.width}/${post.imageData!.size.height}`,
      }}>
        <img src={this.state.imageDownloadUrl}
             alt={'vote'}
             className={classes.voteImage}
             onMouseLeave={() => {
               this.setState({
                 showImageHelp: false,
               })
             }}
             onMouseMove={e => {
               // @ts-ignore
               const rect = e.target.getBoundingClientRect()
               const xPercent = (e.clientX - rect.left) / rect.width
               const yPercent = (e.clientY - rect.top) / rect.height
               this.setState({
                 showImageHelp: xPercent >= 0 && xPercent <= 1 && yPercent >= 0 && yPercent <= 1,
               })
             }}
             onClick={e => {
               if (fbUser) {
                 // @ts-ignore
                 const rect = e.target.getBoundingClientRect()
                 const xPercent = (e.clientX - rect.left) / rect.width
                 const yPercent = (e.clientY - rect.top) / rect.height
                 network.voteImage(post.id, xPercent, yPercent)
                 post.imageData!.results.set(getFBAuth().currentUser!.uid, {x: xPercent, y: yPercent})
                 this.setState({})
               } else {
                 this.props.history.push('/login', {from: '/', title: 'Login to Vote'})
               }
             }}/>
        {dots}
        {this.state.showImageHelp ? <Typography
          style={{
            position: 'absolute',
            left: '50%',
            top: '8px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            transform: 'translateX(-50%)',
            padding: '2px 4px',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}>
          Click anywhere on the image to vote.
        </Typography> : null}
      </div> :
      <div className={classes.imageLoadPlaceHolder}
           style={{aspectRatio: `${post.imageData!.size.width}/${post.imageData!.size.height}`}}>
        <CircularProgress/>
      </div>
  }
}

// @ts-ignore
export const PostComponent = withStyles(styles)(withIsVisible(withRouter(_PostComponent)))

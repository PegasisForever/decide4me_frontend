import {HomeNavbar} from '../components/home_navbar'
import {CircularProgress, createStyles, Fab, makeStyles, Theme, Typography} from '@material-ui/core'
import React, {Component, useEffect, useRef, useState} from 'react'
import CreateIcon from '@material-ui/icons/Create'
import {useHistory} from 'react-router-dom'
import {PostComponent} from '../components/post_component'
import {network} from '../network/network'
import {getFBAuth} from '../auth'
// @ts-ignore
import {useIsVisible} from 'react-is-visible'
import {Post} from '../model/post'
import {User} from '../model/user'

export let refreshPost: (() => void) | null = null

export class HomePage extends Component {
  state: {
    list: Array<{ post: Post, user: User }> | null,
    noMore: boolean,
  } = {
    list: null,
    noMore: false,
  }

  componentDidMount = () => {
    const unsub = getFBAuth().onAuthStateChanged(() => {
      unsub()
      network.getRecommendation(0).then(list => {
        this.setState({list})
      })
      refreshPost = this.refresh
    })
  }

  loadMore = () => {
    network.getRecommendation(this.state.list!.length).then(list => {
      if (list.length === 0) {
        this.setState({
          noMore: true,
        })
      } else {
        this.setState({list: [...this.state.list!, ...list]})
      }
    })
  }

  refresh = () => {
    network.getRecommendation(0).then(list => {
      this.setState({
        list,
        noMore: false,
      })
    })
  }

  render() {
    return <div>
      <HomeNavbar/>
      {this.state.list ? <div style={{
        marginTop: '68px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {this.state.list?.map(({post, user}) => <PostComponent key={post.id} post={post} user={user}/>)}
        {(this.state.list && !this.state.noMore) ?
          <LoadMore key={this.state.list.length} onLoad={this.loadMore}/> : null}
        {this.state.noMore ? <NoMore/> : null}
      </div> : <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
        }}>
        <CircularProgress/>
      </div>}
      <NewPostButton/>
    </div>
  }
}

function LoadMore({onLoad}: { onLoad: () => void }) {
  const nodeRef = useRef<HTMLElement>()
  const isVisible = useIsVisible(nodeRef)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (isVisible && !loaded) {
      setLoaded(true)
      onLoad()
      console.log('load')
    }
  }, [isVisible, loaded, setLoaded, onLoad])

  // @ts-ignore
  return <div ref={nodeRef}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '108px',
                marginTop: '16px',
              }}>
    <CircularProgress/>
  </div>
}

function NoMore() {
  return <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '108px',
    marginTop: '16px',
  }}>
    <Typography>You've reached the end.</Typography>
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

  return <Fab variant="extended" className={classes.fab} color="primary" onClick={() => history.push('/new_post')}>
    <CreateIcon className={classes.icon}/>
    Decide for me
  </Fab>
}

import axios from 'axios'
import firebase from 'firebase/app'
import {getFBAuth} from '../auth'
import {Post} from '../model/post'
import {User} from '../model/user'

const baseUrl = 'https://server-jajlu2sqkq-nn.a.run.app'
// const baseUrl = 'http://25.119.62.232:4000'

export const network = {
  async register(firebaseUser: firebase.User): Promise<void> {
    await axios.post(baseUrl + '/register', {
      idToken: await firebaseUser.getIdToken(),
      profileImageUrl: firebaseUser.photoURL,
      name: firebaseUser.displayName || `User ${firebaseUser.uid.substr(0, 6)}`,
    })
  },

  async newTextPost(title: string, description: string, choices: Array<string>, targetVotes: number, isAnonymous: boolean): Promise<void> {
    await axios.post(baseUrl + '/new_post/text', {
      idToken: await getFBAuth().currentUser!.getIdToken(),
      title,
      description,
      choices,
      targetVotes,
      isAnonymous,
    })
  },

  async newImagePost(title: string, description: string, targetVotes: number, isAnonymous: boolean, image: File): Promise<void> {
    let formData = new FormData()
    formData.append('data', JSON.stringify({
      idToken: await getFBAuth().currentUser!.getIdToken(),
      title,
      description,
      targetVotes,
      isAnonymous,
    }))
    formData.append('image', image)
    await axios({
      method: 'post',
      url: baseUrl + '/new_post/image',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'},
    })
  },

  async voteText(postID: string, choiceIndex: number): Promise<void> {
    await axios.post(baseUrl + '/vote/text', {
      idToken: await getFBAuth().currentUser!.getIdToken(),
      postID,
      choiceIndex,
    })
  },

  async voteImage(postID: string, choiceX: number, choiceY: number): Promise<void> {
    await axios.post(baseUrl + '/vote/image', {
      idToken: await getFBAuth().currentUser!.getIdToken(),
      postID,
      choiceX,
      choiceY,
    })
  },

  async getRecommendation(): Promise<Array<{ post: Post, user: User }>> {
    let idToken: string | null = null
    if (getFBAuth().currentUser) {
      idToken = await getFBAuth().currentUser!.getIdToken()
    }
    const res = await axios.post(baseUrl + '/recommendation', {
      idToken,
      start: 0,
      length: 10,
      refreshID: 'awa',
    })
    // @ts-ignore
    return res.data['data'].map(({id, post, user}) => {
      console.log(user)
      return ({
        post: Post.getFromJson(id, post),
        user: user ? User.fromJson(user) : new User('id', 'temp', '', []),
      })
    })
  },
}

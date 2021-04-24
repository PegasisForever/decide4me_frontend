import axios from 'axios'
import firebase from 'firebase/app'
import {getFBAuth} from '../auth'

const baseUrl = 'https://server-jajlu2sqkq-nn.a.run.app'

export const network = {
  async register(firebaseUser: firebase.User): Promise<void> {
    await axios.post(baseUrl + '/register', {
      idToken: await firebaseUser.getIdToken(),
      profileImageUrl: firebaseUser.photoURL,
      name: firebaseUser.displayName || `User ${firebaseUser.uid.substr(0, 6)}`,
    })
  },

  async newTextPost(title: string, description: string, choices: Array<string>, targetVotes: number): Promise<void> {
    await axios.post(baseUrl + '/new_post/text', {
      idToken: await getFBAuth().currentUser!.getIdToken(),
      title,
      description,
      choices,
      targetVotes,
    })
  },

  async newImagePost(title: string, description: string, targetVotes: number, image: File): Promise<void> {
    let formData = new FormData()
    formData.append('data', JSON.stringify({
      idToken: await getFBAuth().currentUser!.getIdToken(),
      title,
      description,
      targetVotes,
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
}

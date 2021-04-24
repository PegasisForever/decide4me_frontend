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
}

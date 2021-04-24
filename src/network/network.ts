import axios from 'axios'
import firebase from 'firebase/app'

const baseUrl = 'https://server-jajlu2sqkq-nn.a.run.app'

export const network = {
  async register(firebaseUser: firebase.User): Promise<void> {
    await axios.post(baseUrl + '/register', {
      idToken: await firebaseUser.getIdToken(),
      profileImageUrl: firebaseUser.photoURL,
      name: firebaseUser.displayName || `User ${firebaseUser.uid.substr(0, 6)}`,
    })
  },
}

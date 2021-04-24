import firebase from 'firebase/app'

const db = firebase.firestore()

export class Post {
  constructor(
    public id: string,
    public userID: string,
    public title: string,
    public description: string,
    public time: Date,
    public views: number,
    public targetVotes: number,
    public votedUserIDs: Set<string>,
    public textData: TextPostData | null,
    public imageData: ImagePostData | null,
  ) {
  }

  onUpdate = (cb: (post: Post) => void) => {
    return db.collection('posts').doc(this.id)
      .onSnapshot((doc) => {
        cb(Post.getFromDoc(doc))
      })
  }

  static async getFromID(id: string): Promise<Post> {
    const doc = await db.collection('posts').doc(id).get()
    return Post.getFromDoc(doc)
  }

  static getFromDoc(doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Post {
    const data = doc.data()!
    let textData: TextPostData | null = null
    let imageData: ImagePostData | null = null
    if (data['text']) {
      textData = new TextPostData(data['text']['choices'], new Map(Object.entries(data['text']['results'])))
    } else if (data['image']) {
      imageData = new ImagePostData(data['image']['imageUrl'], new Map(Object.entries(data['image']['results'])))
    }
    return new Post(
      doc.id,
      data['userID'],
      data['title'],
      data['description'],
      data['time'].toDate(),
      data['views'],
      data['targetVotes'],
      new Set(data['votedUserIDs']),
      textData,
      imageData,
    )
  }
}

export class TextPostData {
  constructor(
    public choices: Array<{ text: string, vote: number }>,
    public results: Map<string, number>,
  ) {
  }
}

export class ImagePostData {
  constructor(
    public imageUrl: string,
    public results: Map<string, { x: number, y: number }>,
  ) {
  }
}

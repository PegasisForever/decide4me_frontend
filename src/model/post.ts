export class Post {
  constructor(
    public userID: string,
    public title: string,
    public description: string,
    public time: Date,
    public views: number,
    public targetVotes: number,
    public textData: TextPostData | null,
    public imageData: ImagePostData | null,
  ) {
  }
}

export class TextPostData {
  constructor(
    public choices: Array<{ text: string, vote: number }>,
  ) {
  }
}

export class ImagePostData {
  constructor(
    public imageUrl: string,
    public choices: Array<{ x: number, y: number }>,
  ) {
  }
}

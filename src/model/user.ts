export class User {
  constructor(
    public id: string,
    public name: string,
    public profileImageUrl: string,
    public notificationTokens: Array<string>,
  ) {
  }
}

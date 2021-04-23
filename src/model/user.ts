export class User {
  constructor(
    public name: string,
    public profileImageUrl: string,
    public notificationTokens: Array<string>,
  ) {
  }
}

export class User {
  constructor(
    public id: string,
    public name: string,
    public profileImageUrl: string,
    public notificationTokens: Array<string>,
  ) {
  }

  static fromJson(json:any):User{
    return new User(
      json['id'],
      json['name'],
      json['profileImageUrl'],
      json['notificationTokens'],
    )
  }
}

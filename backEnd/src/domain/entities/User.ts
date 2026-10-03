export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public isVerified: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}
}
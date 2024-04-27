export class DB {
  private users: User[] = [];
  private battles: Battle[] = [];

  public createUser(): User {
    const user: User = { id: this.users.length, dragons: [] };
    this.users.push(user);
    return user;
  }
}

export type User = {
  id: number;
  dragons: Dragon[];
};

export class Dragon {
  constructor(private name: string, private user: User) {}
}

export class Battle {
  constructor(private dragons: [Dragon, Dragon]) {}
}

export class DB {
  private users: User[] = [];
  private battles: Battle[] = [];

  public createUser(): User {
    const user = new User(this.users.length, []);
    this.users.push(user);
    return user;
  }

  public getUser(id: number): User | null {
    return this.users[id] ?? null;
  }

  public createDragon(owner: User, name: string): Dragon {
    const dragon = new Dragon(name, owner, null);
    owner.dragons.push(dragon);
    return dragon;
  }
}

export class User {
  constructor(private id: number, public dragons: Dragon[]) {}

  public toFrontend = (): FrontendUser => ({
    id: this.id,
    dragons: this.dragons.map((dragon) => dragon.toFrontend()),
  });
}

export type FrontendUser = {
  id: number;
  dragons: FrontendDragon[];
};

let nextDragonId = 0;

export class Dragon {
  private id: number;

  constructor(
    private name: string,
    private owner: User,
    private battle: Battle | null
  ) {
    this.id = nextDragonId++;
  }

  public toFrontend = (): FrontendDragon => ({ id: this.id, name: this.name });
}

export type FrontendDragon = { id: number; name: string };

export class Battle {
  constructor(private dragons: [Dragon, Dragon]) {}
}

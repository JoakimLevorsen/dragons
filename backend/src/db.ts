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

  public createBattle(
    owner: User,
    dragonIds: [number, number]
  ): Battle | string {
    const first = owner.dragons.find((dragon) => dragon.id === dragonIds[0]);
    const second = owner.dragons.find((dragon) => dragon.id === dragonIds[1]);
    if (!first) {
      return `Failed to find dragon with id ${dragonIds[0]}`;
    }
    if (!second) {
      return `Failed to find dragon with id ${dragonIds[1]}`;
    }
    if (first.id === second.id) {
      return "Cannot battle dragon with itself";
    }
    const battle = new Battle([first, second]);
    this.battles.push(battle);
    return battle;
  }

  public getBattle(first: number, second: number) {
    console.log(`Looking for (${first}, ${second}) in `, this.battles);
    return this.battles.find(
      (battle) =>
        (battle.dragonsIds[0] === first && battle.dragonsIds[1] === second) ||
        (battle.dragonsIds[0] === second && battle.dragonsIds[1] === first)
    );
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
  private _id: number;
  private strength: number;

  public get id() {
    return this._id;
  }

  constructor(
    private name: string,
    private owner: User,
    private battle: Battle | null
  ) {
    this._id = nextDragonId++;
    this.strength = 20 + Math.floor(Math.random() * 20);
  }

  public attack() {
    return this.strength + (Math.floor(10 * Math.random()) - 5);
  }

  public toFrontend = (): FrontendDragon => ({
    id: this.id,
    name: this.name,
    strength: this.strength,
  });
}

export type FrontendDragon = { id: number; name: string; strength: number };

type BattleDragon = { dragon: Dragon; health: number };

export type BattleState =
  | { type: "ongoing" }
  | { type: "draw" }
  | { type: "victor"; dragon: Dragon };
export class Battle {
  private _dragons: [BattleDragon, BattleDragon];

  public get state(): BattleState {
    const [a, b] = this._dragons;
    if (a.health > 0 && b.health > 0) {
      return { type: "ongoing" };
    } else if (a.health < 0 && b.health < 0) {
      return { type: "draw" };
    } else if (a.health > 0) {
      return { type: "victor", dragon: a.dragon };
    } else {
      return { type: "victor", dragon: b.dragon };
    }
  }

  constructor(dragons: [Dragon, Dragon]) {
    this._dragons = dragons.map((dragon) => ({ dragon, health: 100 })) as [
      BattleDragon,
      BattleDragon
    ];
  }

  public get dragonsIds() {
    return this._dragons.map(({ dragon }) => dragon.id);
  }

  public iterate() {
    if (this.state.type !== "ongoing") {
      return;
    }

    this._dragons[0].health -= this._dragons[1].dragon.attack();
    this._dragons[1].health -= this._dragons[0].dragon.attack();
  }

  public toFrontend(): FrontendBattle {
    const state = this.state;
    return {
      dragons: this._dragons.map(({ dragon, health }) => ({
        ...dragon.toFrontend(),
        health,
      })) as FrontendBattle["dragons"],
      state:
        state.type === "victor"
          ? { type: "victor", dragon: state.dragon.toFrontend() }
          : state,
    };
  }
}

export type FrontendBattle = {
  dragons: [
    FrontendDragon & { health: number },
    FrontendDragon & { health: number }
  ];
  state: FrontendBattleState;
};
export type FrontendBattleState =
  | { type: "ongoing" }
  | { type: "draw" }
  | { type: "victor"; dragon: FrontendDragon };

import { useState } from "react";
import { FrontendBattle, FrontendDragon, FrontendUser } from "../App";
import { BattlePage } from "./BattlePage";

type Props = { user: FrontendUser; updateUser: () => void };

export const DragonOverview: React.FC<Props> = ({ user, updateUser }) => {
  const [newName, setNewName] = useState("");

  const [first, setFirst] = useState<FrontendDragon | null>(null);
  const [second, setSecond] = useState<FrontendDragon | null>(null);

  const [openBattle, setOpenBattle] = useState<FrontendBattle | null>(null);

  if (openBattle) {
    return (
      <BattlePage user={user} battle={openBattle} setBattle={setOpenBattle} />
    );
  }

  console.log("Set", { first, second, dragons: user.dragons });

  return (
    <div>
      <h1>User {user.id}'s Dragons </h1>
      <div>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button
          onClick={async () => {
            const response = await fetch("http://localhost:4000/dragon", {
              method: "PUT",
              body: JSON.stringify({ name: newName, userId: user.id }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              alert(`Failed to create dragon due to ${await response.text()}`);
              return;
            }

            setNewName("");
            updateUser();
          }}
        >
          Create new Dragon
        </button>
      </div>
      <div>
        <h2>Dragons</h2>
        {user.dragons.map((dragon) => (
          <p key={dragon.id}>
            {dragon.name}, Strength {dragon.strength}
          </p>
        ))}
      </div>
      <div>
        <h2>Start battle</h2>
        <select
          name="First"
          onChange={(e) => {
            console.log(
              "e",
              e,
              e.target.value,
              user.dragons,
              user.dragons.find(
                (dragon) => dragon.id === +(e.target as any).value
              )!
            );
            setFirst(
              user.dragons.find(
                (dragon) => dragon.id === +(e.target as any).value
              )!
            );
          }}
        >
          {user.dragons
            .filter((dragon) => dragon.id !== second?.id)
            .map((dragon) => (
              <option key={dragon.id} value={dragon.id}>
                {dragon.name}
              </option>
            ))}
        </select>
        <select
          name="Second"
          onChange={(e) =>
            setSecond(
              user.dragons.find(
                (dragon) => dragon.id === +(e.target as any).value
              )!
            )
          }
        >
          {user.dragons
            .filter((dragon) => dragon.id !== first?.id)
            .map((dragon) => (
              <option key={dragon.id} value={dragon.id}>
                {dragon.name}
              </option>
            ))}
        </select>
        <button
          disabled={!first || !second}
          onClick={async () => {
            if (!first || !second) return;
            const response = await fetch("http://localhost:4000/battle", {
              method: "POST",
              body: JSON.stringify({
                userId: user.id,
                dragons: [first.id, second.id],
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              alert(`Failed to create battle due to ${await response.text()}`);
              return;
            }

            setOpenBattle(await response.json());
            setFirst(null);
            setSecond(null);
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
};

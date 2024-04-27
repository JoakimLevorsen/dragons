import { FrontendBattle, FrontendUser } from "../App";

type Props = {
  user: FrontendUser;
  battle: FrontendBattle;
  setBattle: (battle: FrontendBattle | null) => void;
};

export const BattlePage: React.FC<Props> = ({ user, battle, setBattle }) => {
  return (
    <div>
      <h1>
        Battleing {battle.dragons[0].name} against {battle.dragons[1].name}
      </h1>
      {battle.dragons.map((dragon) => (
        <div key={dragon.id}>
          {Object.entries(dragon).map(([key, value]) => (
            <p key={key}>
              {key}:{value}
            </p>
          ))}
        </div>
      ))}
      {battle.state.type === "ongoing" ? (
        <button
          onClick={async () => {
            const response = await fetch(
              `http://localhost:4000/battle/${battle.dragons[0].id}/${battle.dragons[1].id}/takeTurn`,
              {
                method: "PATCH",
                body: JSON.stringify({}),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              alert(`Failed to take turn due to ${await response.text()}`);
              return;
            }

            setBattle(await response.json());
          }}
        >
          Next step
        </button>
      ) : (
        <>
          <p>
            {battle.state.type === "draw"
              ? "Battle ended in a draw"
              : `${battle.state.dragon.name} won the battle!`}
          </p>
          <button onClick={() => setBattle(null)}>Go back</button>
        </>
      )}
    </div>
  );
};
